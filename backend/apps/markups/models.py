from django.db import models
from django.core.validators import RegexValidator
from apps.core.models import Empleado, EstadoMarkup, TipoMarkup

class Markup(models.Model):
    # Definimos el validador: solo letras
    revisión_validator = RegexValidator(
        regex=r'^[a-zA-Z]*$',
        message='La revisión solo puede contener letras.'
    )

    # Campos básicos
    numero_parte = models.CharField(max_length=50)
    descripcion = models.TextField()
    nueva_revision = models.CharField(max_length=5, validators=[revisión_validator]) # solo acepta letras y números, sin espacios ni caracteres especiales
    url_archivo = models.URLField(max_length=300, blank=True, null=True)

    # Relaciones
    # Con models.PROTECT evitamos borrar un empleado si tiene markups asociados
    responsable = models.ForeignKey(
        Empleado,
        on_delete=models.PROTECT,
        related_name='markups'
    )

    estado = models.ForeignKey(
        EstadoMarkup,
        on_delete=models.PROTECT,
        related_name='markups'
    )
    
    tipo_markup = models.ForeignKey(
        TipoMarkup,
        on_delete=models.PROTECT,
        related_name='markups'
    )

    # Fechas automáticas
    fecha_creacion = models.DateField(auto_now_add=True)
    fecha_compromiso = models.DateField(null=True, blank=True)
    fecha_modificacion = models.DateField(auto_now=True) # Necesario para auditoría

    class Meta:
        ordering = ['-fecha_creacion'] # Los más recientes primero
        verbose_name = "Markup"
        verbose_name_plural = "Markups"

