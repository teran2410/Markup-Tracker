from django.contrib import admin
from django.urls import path
from django.http import JsonResponse


def health(request):
    """Simple health check endpoint used by frontend and load balancers."""
    return JsonResponse({'status': 'ok'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health, name='api-health'),
]
