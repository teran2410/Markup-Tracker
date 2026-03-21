from django.db import models
from apps.core.models import Empleado
from apps.markups.models import Markup

class Comentario(models.Model):
    # Campos básicos
    contenido = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    # Relaciones
    markup = models.ForeignKey(
        Markup,
        on_delete=models.CASCADE,
        related_name='comentarios'
        )

    empleado = models.ForeignKey(
        Empleado, 
        on_delete=models.CASCADE, 
        related_name='comentarios'
        )
    
    class Meta:
        ordering = ['fecha_creacion'] # Los más antiguos primero
        verbose_name = "Comentario"
        verbose_name_plural = "Comentarios"