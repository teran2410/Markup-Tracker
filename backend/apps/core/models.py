# ...existing code...
from django.db import models


class Rol(models.Model):
    # Rol de un empleado (p. ej. técnico, supervisor, admin).

    nombre = models.CharField(max_length=50, unique=True)
    abreviatura = models.CharField(max_length=10, blank=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre


class Area(models.Model):
    # Área/Departamento donde opera el empleado (p. ej. Producción, Mantenimiento).

    nombre = models.CharField(max_length=100, unique=True)
    acronimo = models.CharField(max_length=10, blank=True)

    def __str__(self):
        # Retornar Acronimo + nombre
        return f"{self.acronimo} - {self.nombre}"


class EstadoMarkup(models.Model):
    """
    Estados posibles de un Markup p. ej.:
    - Abierto
    - En proceso
    - En firmas
    - Configuration Check
    - Pending Approval
    - Released
    """

    nombre = models.CharField(max_length=50, unique=True)
    orden = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return self.nombre


class Empleado(models.Model):
    """
    Representa a un empleado del sistema.

    Notas de diseño:
    - Usamos `email` como identificador único adicional.
    - `user_id` puede mapearse al `id` del usuario de Azure AD o al `auth.User` cuando lo integremos.
    - `activo` permite desactivar empleados sin borrarlos (importante para auditoría).
    """
    nombre = models.CharField(max_length=150)
    numero_empleado = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT, related_name='empleados')
    area = models.ForeignKey(Area, on_delete=models.PROTECT, related_name='empleados')
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} <{self.email}>"