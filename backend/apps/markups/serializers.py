from rest_framework import serializers
from django.utils import timezone
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
            'fecha_creacion', 'fecha_compromiso'
        ]

    # VALIDACIÓN PERSONALIZADA (Nivel Backend)
    def validate_fecha_compromiso(self, value):
        if value and value < timezone.now().date():
            raise serializers.ValidationError("La fecha de compromiso no puede ser en el pasado.")
        return value

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