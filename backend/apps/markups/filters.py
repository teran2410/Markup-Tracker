import django_filters
from .models import Markup


class MarkupFilter(django_filters.FilterSet):
    """
    Filtros disponibles para /api/markups/:
      ?estado=1           → por estado exacto
      ?responsable=3      → por responsable (empleado id)
      ?tipo_markup=2      → por tipo de markup
      ?fecha_desde=2026-01-01  → creados a partir de
      ?fecha_hasta=2026-03-31  → creados hasta
    """
    fecha_desde = django_filters.DateFilter(field_name='fecha_creacion', lookup_expr='gte')
    fecha_hasta = django_filters.DateFilter(field_name='fecha_creacion', lookup_expr='lte')

    class Meta:
        model = Markup
        fields = ['estado', 'responsable', 'tipo_markup']
