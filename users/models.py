from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('ING', 'Ingeniero (Admin)'),
        ('TEC', 'Técnico'),
        ('AUD', 'Auditor'),
    ]
    
    role = models.CharField(max_length=3, choices=ROLE_CHOICES, default='TEC')
    
    numero_empleado = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email' 
    
    # Campos obligatorios para la creación de un superusuario (admin)
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'numero_empleado']

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.numero_empleado}"
