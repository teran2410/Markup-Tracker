from django.contrib import admin
from .models import Rol, Area, EstadoMarkup, Empleado


@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
	list_display = ('nombre',)


@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
	list_display = ('nombre',)


@admin.register(EstadoMarkup)
class EstadoMarkupAdmin(admin.ModelAdmin):
	list_display = ('nombre', 'orden')


@admin.register(Empleado)
class EmpleadoAdmin(admin.ModelAdmin):
	list_display = ('nombre', 'email', 'rol', 'area', 'activo')
	list_filter = ('activo', 'rol', 'area')
	search_fields = ('nombre', 'email')
