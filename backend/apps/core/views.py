from rest_framework import viewsets
from .models import Area, Rol, EstadoMarkup, Empleado, TipoMarkup
from .serializers import AreaSerializer, RolSerializer, EstadoMarkupSerializer, EmpleadoSerializer, TipoMarkupSerializer

class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

class EstadoMarkupViewSet(viewsets.ModelViewSet):
    queryset = EstadoMarkup.objects.all()
    serializer_class = EstadoMarkupSerializer

class TipoMarkupViewSet(viewsets.ModelViewSet):
    queryset = TipoMarkup.objects.all()
    serializer_class = TipoMarkupSerializer

class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer