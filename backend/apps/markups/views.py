from rest_framework import viewsets, filters
from .models import Markup
from .serializers import MarkupSerializer

class MarkupViewSet(viewsets.ModelViewSet):
    queryset = Markup.objects.all()
    serializer_class = MarkupSerializer
    
    # Capacidades de búsqueda y filtrado
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['numero_parte', 'responsable__nombre', 'descripcion']
    ordering_fields = ['fecha_creacion', 'fecha_compromiso']