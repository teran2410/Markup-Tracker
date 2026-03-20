from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from apps.core.views import AreaViewSet, RolViewSet, EstadoMarkupViewSet, EmpleadoViewSet
from apps.markups.views import MarkupViewSet

def health(request):
    """Simple health check endpoint used by frontend and load balancers."""
    return JsonResponse({'status': 'ok'})

router = DefaultRouter()
router.register(r'areas', AreaViewSet, basename='area')
router.register(r'roles', RolViewSet, basename='rol')
router.register(r'estados-markup', EstadoMarkupViewSet, basename='estado-markup')
router.register(r'empleados', EmpleadoViewSet, basename='empleado')
router.register(r'markups', MarkupViewSet, basename='markup')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health, name='api-health'),
    path('api/', include(router.urls)),
]
