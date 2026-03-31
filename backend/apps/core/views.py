from rest_framework import viewsets
from .models import Area, Rol, EstadoMarkup, Empleado, TipoMarkup
from .serializers import AreaSerializer, RolSerializer, EstadoMarkupSerializer, EmpleadoSerializer, TipoMarkupSerializer
from .permissions import IsAdminOrReadOnly


class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [IsAdminOrReadOnly]


class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [IsAdminOrReadOnly]


class EstadoMarkupViewSet(viewsets.ModelViewSet):
    queryset = EstadoMarkup.objects.all()
    serializer_class = EstadoMarkupSerializer
    permission_classes = [IsAdminOrReadOnly]


class TipoMarkupViewSet(viewsets.ModelViewSet):
    queryset = TipoMarkup.objects.all().order_by('id')
    serializer_class = TipoMarkupSerializer
    permission_classes = [IsAdminOrReadOnly]


class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer
    permission_classes = [IsAdminOrReadOnly]