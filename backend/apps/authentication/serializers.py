from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class EmpleadoMiniSerializer(serializers.Serializer):
    """Datos mínimos del empleado vinculado al User."""
    id = serializers.IntegerField()
    nombre = serializers.CharField()
    numero_empleado = serializers.CharField()
    area = serializers.StringRelatedField()
    rol = serializers.StringRelatedField()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para mostrar información del usuario autenticado.
    Incluye datos del empleado vinculado (si existe).
    """
    empleado = EmpleadoMiniSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'empleado']
        read_only_fields = ['id', 'is_staff']
