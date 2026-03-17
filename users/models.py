from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # ROLES: Definimos quién es quién
    ROLE_CHOICES = [
        ('ING', 'Ingeniero (Admin)'),
        ('TEC', 'Técnico'),
        ('AUD', 'Auditor'),
    ]
    
    role = models.CharField(max_length=3, choices=ROLE_CHOICES, default='TEC')
    
    # NUEVOS CAMPOS: Estos no existen en Django, los creamos nosotros
    numero_empleado = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)

    # CONFIGURACIÓN: Cómo se comporta el modelo
    USERNAME_FIELD = 'email'  # Se usará el correo para iniciar sesión
    
    # Campos obligatorios para la creación de un superusuario (admin)
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'numero_empleado']

    def __str__(self):
        # Esto es lo que verás en el panel de administración
        return f"{self.first_name} {self.last_name} - {self.numero_empleado}"