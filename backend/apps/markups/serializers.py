from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import Markup
from apps.core.serializers import EmpleadoSerializer, EstadoMarkupSerializer, AreaSerializer, TipoMarkupSerializer
from apps.comments.serializers import ComentarioSerializer

class MarkupSerializer(serializers.ModelSerializer):
    # Campos de solo lectura para mostrar info detallada en el GET
    responsable_detalle = EmpleadoSerializer(source='responsable', read_only=True)
    estado_detalle = EstadoMarkupSerializer(source='estado', read_only=True)
    comentarios = ComentarioSerializer(many=True, read_only=True)
    tipo_markup_detalle = TipoMarkupSerializer(source='tipo_markup', read_only=True)

    class Meta:
        model = Markup
        fields = [
            'id', 'numero_parte', 'descripcion', 'nueva_revision', 
            'url_archivo', 'responsable', 'responsable_detalle', 
            'estado', 'estado_detalle', 'tipo_markup', 'tipo_markup_detalle', 'comentarios',
            'fecha_creacion', 'fecha_compromiso', 'fecha_registro'
        ]

    # Campo de entrada opcional: fecha_registro (write-only)
    fecha_registro = serializers.DateField(write_only=True, required=False)

    def validate_fecha_compromiso(self, value):
        if value and value < timezone.now().date():
            raise serializers.ValidationError("La fecha de compromiso no puede ser en el pasado.")
        return value

    def validate_fecha_registro(self, value):
        # No permitir fechas de registro en el futuro respecto al servidor
        today = timezone.localdate()
        if value and value > today:
            raise serializers.ValidationError("La fecha de registro no puede ser futura.")
        return value

    def _add_business_days(self, start_date, days):
        # start_date: date
        d = start_date
        added = 0
        while added < days:
            d = d + timedelta(days=1)
            if d.weekday() < 5:  # 0..4 => Monday..Friday
                added += 1
        return d

    def create(self, validated_data):
        # Extraemos fecha_registro si fue enviada por el cliente
        fecha_registro = validated_data.pop('fecha_registro', None)

        # Si no viene, usamos la fecha del servidor
        if fecha_registro is None:
            fecha_registro = timezone.localdate()

        # Calculamos fecha_compromiso = fecha_registro + 7 días hábiles
        fecha_compromiso = self._add_business_days(fecha_registro, 7)

        # Si el modelo permite asignar fecha_creacion, la seteamos explícitamente
        # para respetar la fecha_registro enviada. De lo contrario auto_now_add
        # pondrá la fecha actual del servidor.
        validated_data['fecha_compromiso'] = fecha_compromiso
        # Intentamos setear fecha_creacion sólo si el modelo lo acepta al crear
        try:
            validated_data['fecha_creacion'] = fecha_registro
        except Exception:
            pass

        return super().create(validated_data)

    # VALIDACIÓN DE NEGOCIO: No permitir duplicar números de parte activos
    def validate(self, data):
        # Si estamos creando uno nuevo y el número de parte ya existe en estado "Abierto"
        if self.context['request'].method == 'POST':
            exists = Markup.objects.filter(
                numero_parte=data['numero_parte'],
                estado__nombre__in=['Abierto', 'En proceso', 'En firmas', 'Configuration Check', 'Pending Approval'],
            ).exists()
            if exists:
                raise serializers.ValidationError(
                    {"numero_parte": "Ya existe un Markup en curso para este número de parte."}
                )
        return data