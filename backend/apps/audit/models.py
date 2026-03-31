from django.db import models
from django.conf import settings


class AuditLog(models.Model):
    """
    Registro de auditoría para acciones sobre recursos del sistema.
    Captura quién, qué, cuándo y los cambios realizados.
    """

    class Action(models.TextChoices):
        CREATE = 'CREATE', 'Creación'
        UPDATE = 'UPDATE', 'Actualización'
        DELETE = 'DELETE', 'Eliminación'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='audit_logs',
    )
    action = models.CharField(max_length=10, choices=Action.choices)
    model_name = models.CharField(max_length=100, help_text='Nombre del modelo afectado')
    object_id = models.PositiveIntegerField(help_text='PK del objeto afectado')
    object_repr = models.CharField(max_length=255, blank=True, help_text='Representación legible')
    changes = models.JSONField(default=dict, blank=True, help_text='Diff de campos modificados')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Registro de auditoría'
        verbose_name_plural = 'Registros de auditoría'

    def __str__(self):
        return f'{self.get_action_display()} {self.model_name}#{self.object_id} by {self.user}'
