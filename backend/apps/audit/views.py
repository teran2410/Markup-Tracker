from rest_framework import viewsets, filters
from rest_framework.permissions import IsAdminUser
from .models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """"Solo lectura — solo staff puede ver los registros de auditoría."""
    queryset = AuditLog.objects.select_related('user').all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['object_repr', 'user__username', 'model_name']
    ordering_fields = ['timestamp']
