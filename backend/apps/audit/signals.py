from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver

from apps.markups.models import Markup
from .models import AuditLog

# Thread-local para almacenar el request (lo inyecta el middleware)
import threading
_thread_locals = threading.local()


def get_current_user():
    return getattr(_thread_locals, 'user', None)


def get_current_ip():
    return getattr(_thread_locals, 'ip', None)


def set_current_request(request):
    _thread_locals.user = getattr(request, 'user', None)
    ip = request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip()
    _thread_locals.ip = ip or request.META.get('REMOTE_ADDR')


# ---------------------------------------------------------------
# PRE-SAVE: guardar snapshot del objeto ANTES de ser modificado
# ---------------------------------------------------------------
@receiver(pre_save, sender=Markup)
def markup_pre_save(sender, instance, **kwargs):
    if instance.pk:
        try:
            old = Markup.objects.get(pk=instance.pk)
            instance._old_values = {
                f.name: str(getattr(old, f.name))
                for f in old._meta.fields
            }
        except Markup.DoesNotExist:
            instance._old_values = {}
    else:
        instance._old_values = {}


# ---------------------------------------------------------------
# POST-SAVE: registrar CREATE o UPDATE
# ---------------------------------------------------------------
@receiver(post_save, sender=Markup)
def markup_post_save(sender, instance, created, **kwargs):
    user = get_current_user()
    ip = get_current_ip()

    if created:
        AuditLog.objects.create(
            user=user if user and user.is_authenticated else None,
            action=AuditLog.Action.CREATE,
            model_name='Markup',
            object_id=instance.pk,
            object_repr=str(instance),
            changes={},
            ip_address=ip,
        )
    else:
        old_values = getattr(instance, '_old_values', {})
        changes = {}
        for field in instance._meta.fields:
            new_val = str(getattr(instance, field.name))
            old_val = old_values.get(field.name)
            if old_val is not None and old_val != new_val:
                changes[field.name] = {'old': old_val, 'new': new_val}

        if changes:
            AuditLog.objects.create(
                user=user if user and user.is_authenticated else None,
                action=AuditLog.Action.UPDATE,
                model_name='Markup',
                object_id=instance.pk,
                object_repr=str(instance),
                changes=changes,
                ip_address=ip,
            )


# ---------------------------------------------------------------
# POST-DELETE: registrar DELETE
# ---------------------------------------------------------------
@receiver(post_delete, sender=Markup)
def markup_post_delete(sender, instance, **kwargs):
    user = get_current_user()
    ip = get_current_ip()

    AuditLog.objects.create(
        user=user if user and user.is_authenticated else None,
        action=AuditLog.Action.DELETE,
        model_name='Markup',
        object_id=instance.pk,
        object_repr=str(instance),
        changes={},
        ip_address=ip,
    )
