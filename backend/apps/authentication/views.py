from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer

# ========================================
# Endpoint 1: Login (obtener token)
# ========================================
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    POST /auth/login/
    
    Recibe: { "username": "...", "password": "..." }
    Retorna: { "success": true, "user": {...} }
    
    🔐 SEGURIDAD: Los tokens se guardan en httpOnly cookies, NO en el body.
    
    ¿Por qué httpOnly?
    - JavaScript NO puede acceder a estas cookies (protección contra XSS)
    - El navegador las envía automáticamente en cada request
    - Secure=True → solo por HTTPS
    - SameSite=Lax → protección contra CSRF
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username y password son requeridos'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Autenticar usuario
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response(
            {'error': 'Credenciales inválidas'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Generar tokens JWT
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)
    
    # Crear respuesta
    response = Response({
        'success': True,
        'user': UserSerializer(user).data
    })
    
    # 🔐 Guardar tokens en httpOnly cookies
    response.set_cookie(
        key='access_token',
        value=access_token,
        httponly=True,        # No accesible desde JavaScript
        secure=False,         # False para desarrollo local (cambiar a True en producción HTTPS)
        samesite='None' if False else 'Lax',  # None requiere secure=True, usamos Lax para desarrollo
        max_age=3600,         # 1 hora (igual que ACCESS_TOKEN_LIFETIME)
        domain=None,          # None = cookie disponible solo para el dominio actual
    )
    
    response.set_cookie(
        key='refresh_token',
        value=refresh_token,
        httponly=True,
        secure=False,         # False para desarrollo local
        samesite='None' if False else 'Lax',
        max_age=604800,       # 7 días (igual que REFRESH_TOKEN_LIFETIME)
        domain=None,
    )
    
    return response


# ========================================
# Endpoint 2: Refresh token
# ========================================
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """
    POST /auth/refresh/
    
    Lee el refresh_token de la cookie, genera un nuevo access_token.
    Retorna: { "success": true }
    
    El nuevo access_token se guarda automáticamente en la cookie.
    """
    refresh_token_value = request.COOKIES.get('refresh_token')
    
    if not refresh_token_value:
        return Response(
            {'error': 'Refresh token no encontrado'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    try:
        # Generar nuevo access token
        refresh = RefreshToken(refresh_token_value)
        access_token = str(refresh.access_token)
        
        response = Response({'success': True})
        
        # Actualizar cookie de access_token
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=False,
            samesite='None' if False else 'Lax',
            max_age=3600,
            domain=None,
        )
        
        return response
        
    except Exception as e:
        return Response(
            {'error': 'Refresh token inválido o expirado'},
            status=status.HTTP_401_UNAUTHORIZED
        )


# ========================================
# Endpoint 3: Logout
# ========================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    POST /auth/logout/
    
    Limpia las cookies de autenticación.
    """
    response = Response({'success': True, 'message': 'Sesión cerrada'})
    
    # Eliminar cookies
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    
    return response


# ========================================
# Endpoint 4: Obtener usuario actual
# ========================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    GET /auth/me/
    
    Retorna los datos del usuario autenticado.
    El token se lee automáticamente de la cookie por el middleware.
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
