from rest_framework import serializers
from .models import Area, Rol, EstadoMarkup, Empleado, TipoMarkup

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class EstadoMarkupSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoMarkup
        fields = '__all__'

class TipoMarkupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoMarkup
        fields = '__all__'

class EmpleadoSerializer(serializers.ModelSerializer):
    rol_detalle = RolSerializer(source='rol', read_only=True)
    area_detalle = AreaSerializer(source='area', read_only=True)

    class Meta:
        model = Empleado
        fields = [
            'id', 'nombre', 'numero_empleado', 'email', 
            'rol', 'rol_detalle', 'area', 'area_detalle', 
            'activo', 'fecha_creacion'
        ]