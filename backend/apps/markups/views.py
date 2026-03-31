from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Markup
from .serializers import MarkupSerializer
from .filters import MarkupFilter
from apps.core.permissions import IsOwnerOrAdmin


class MarkupViewSet(viewsets.ModelViewSet):
    queryset = Markup.objects.all()
    serializer_class = MarkupSerializer
    permission_classes = [IsOwnerOrAdmin]

    # Filtrado, búsqueda y ordenamiento
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = MarkupFilter
    search_fields = ['numero_parte', 'responsable__nombre', 'descripcion']
    ordering_fields = ['fecha_creacion', 'fecha_compromiso']

    def perform_create(self, serializer):
        """Auto-asignar el empleado vinculado al usuario autenticado como responsable."""
        empleado = getattr(self.request.user, 'empleado', None)
        if empleado is None:
            from rest_framework.exceptions import ValidationError
            raise ValidationError(
                {'responsable': 'Tu cuenta no tiene un empleado vinculado. Contacta al administrador.'}
            )
        serializer.save(responsable=empleado)