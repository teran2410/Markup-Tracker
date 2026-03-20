from django.contrib import admin
from .models import Markup

@admin.register(Markup)
class MarkupAdmin(admin.ModelAdmin):
    list_display = ('numero_parte', 'descripcion', 'responsable', 'estado', 'fecha_compromiso')
    # buscar por solo el nombre del responsable (sin el email)
    list_filter = ('estado', 'responsable__nombre')
    search_fields = ('numero_parte', 'descripcion')