"""
Permisos reutilizables para toda la aplicación.

- ReadOnly: cualquier usuario autenticado puede leer.
- IsAdminOrReadOnly: solo admin puede crear/editar/borrar; el resto solo lee.
- IsOwnerOrAdmin: solo el responsable del markup o admin puede editar/borrar.
"""
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    """
    GET/HEAD/OPTIONS → cualquier autenticado.
    POST/PUT/PATCH/DELETE → solo staff/admin.
    Ideal para catálogos (áreas, roles, estados, tipos).
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class IsOwnerOrAdmin(BasePermission):
    """
    Nivel de objeto: solo el responsable del markup (vía empleado.user)
    o un admin pueden editar/borrar. Lectura libre para autenticados.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if request.user.is_staff:
            return True
        # obj.responsable es un Empleado; comparamos su .user con request.user
        responsable_user = getattr(obj.responsable, 'user', None)
        return responsable_user == request.user


class IsCommentOwnerOrAdmin(BasePermission):
    """
    Solo el autor del comentario (vía empleado.user) o admin puede editar/borrar.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if request.user.is_staff:
            return True
        empleado_user = getattr(obj.empleado, 'user', None)
        return empleado_user == request.user
