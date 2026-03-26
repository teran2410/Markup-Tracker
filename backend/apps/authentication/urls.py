from django.urls import path
from .views import login, refresh_token, logout, current_user

urlpatterns = [
    path('login/', login, name='login'),
    path('refresh/', refresh_token, name='token_refresh'),
    path('logout/', logout, name='logout'),
    path('me/', current_user, name='current_user'),
]
