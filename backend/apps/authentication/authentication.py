"""
Custom JWT Authentication que lee el token de httpOnly cookies.

SimpleJWT por defecto lee el token del header Authorization,
pero nosotros lo guardamos en cookies para mayor seguridad.
"""

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken


class JWTCookieAuthentication(JWTAuthentication):
    """
    Extensión de JWTAuthentication que lee el access_token de las cookies.
    
    Orden de prioridad:
    1. Cookie 'access_token' (nuestro método seguro)
    2. Header Authorization (fallback para compatibilidad)
    """
    
    def authenticate(self, request):
        # Primero intentar leer del header (método estándar)
        header = self.get_header(request)
        
        if header is None:
            # Si no hay header, intentar leer de la cookie
            raw_token = request.COOKIES.get('access_token')
            
            if raw_token is None:
                return None
                
        else:
            # Hay header, extraer token del formato "Bearer <token>"
            raw_token = self.get_raw_token(header)
            
        if raw_token is None:
            return None

        # Validar y decodificar el token
        validated_token = self.get_validated_token(raw_token)
        
        # Retornar tupla (user, token)
        return self.get_user(validated_token), validated_token
