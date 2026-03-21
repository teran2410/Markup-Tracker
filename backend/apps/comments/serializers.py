from rest_framework import serializers
from .models import Comentario
from apps.core.serializers import EmpleadoSerializer

class ComentarioSerializer(serializers.ModelSerializer):
    # Para saber quién escribió el comentario sin hacer otra petición
    empleado_detalle = EmpleadoSerializer(source='empleado', read_only=True)

    class Meta:
        model = Comentario
        fields = ['id', 'contenido', 'fecha_creacion', 'markup', 'empleado', 'empleado_detalle']