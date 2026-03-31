from pathlib import Path
from datetime import timedelta
import environ

# BASE_DIR apunta a la carpeta /backend/
BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, True),   # Por defecto DEBUG=True si no está en .env
)

# Lee el archivo .env que está en la raíz del proyecto (un nivel arriba de backend/)
environ.Env.read_env(BASE_DIR.parent / '.env')

SECRET_KEY = env('SECRET_KEY')

DEBUG = env('DEBUG')

# ALLOWED_HOSTS: lista de dominios que pueden acceder al backend.
# En desarrollo usamos localhost. En producción va el dominio real.
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost', '127.0.0.1'])


# Orden: primero las de Django, luego librerías externas, luego las nuestras.
INSTALLED_APPS = [
    # Apps nativas de Django
    'django.contrib.admin',        # Panel de administración visual
    'django.contrib.auth',         # Sistema de autenticación (usuarios, permisos)
    'django.contrib.contenttypes', # Permite relaciones genéricas entre modelos
    'django.contrib.sessions',     # Manejo de sesiones de usuario
    'django.contrib.messages',     # Sistema de mensajes flash (éxito, error, etc.)
    'django.contrib.staticfiles',  # Manejo de CSS, JS, imágenes

    # Librerías externas
    'rest_framework',              # Django REST Framework: construye APIs REST
    'rest_framework_simplejwt.token_blacklist',  # Blacklist de tokens JWT revocados
    'corsheaders',                 # Permite que el frontend (otro dominio) llame al backend
    'django_filters',              # Filtros server-side para DRF

    # Nuestras apps (prefijo apps. porque están en la carpeta apps/)
    'apps.core',
    'apps.markups',
    'apps.comments',
    'apps.audit',
    'apps.authentication',
]

# - El orden importa: CorsMiddleware DEBE ir antes de CommonMiddleware.
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'apps.audit.middleware.AuditMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'markups_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'markups_project.wsgi.application'

DATABASES = {
    'default': {
        **env.db('DATABASE_URL'),
        # OPTIONS adicionales para Supabase: forzar SSL (conexión cifrada)
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'apps.authentication.authentication.JWTCookieAuthentication',  # 🍪 Lee JWT de cookies httpOnly
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',  # 🔒 Ahora TODOS los endpoints requieren autenticación
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# ACCESS_TOKEN_LIFETIME: cuánto dura el token de acceso.
# - 1 hora es un balance entre seguridad (corto) y comodidad (no pedir login cada rato).
#
# REFRESH_TOKEN_LIFETIME: cuánto dura el token de renovación.
# - 7 días: si el usuario usa la app en una semana, no necesita volver a loguearse.
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),  # 7 días = 604800 segundos
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# En producción: CORS_ALLOWED_ORIGINS=https://mi-app.vercel.app,https://otro.com
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
])

# Permite que el frontend envíe cookies/credenciales en los requests
CORS_ALLOW_CREDENTIALS = True

# ---------------------------------------------------------------------------
# RATE LIMITING (Throttling)
# ---------------------------------------------------------------------------
REST_FRAMEWORK['DEFAULT_THROTTLE_CLASSES'] = [
    'rest_framework.throttling.AnonRateThrottle',
    'rest_framework.throttling.UserRateThrottle',
]
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
    'anon': '30/minute',    # Requests sin autenticar (login, refresh)
    'user': '120/minute',   # Requests autenticados
}

# ---------------------------------------------------------------------------
# VALIDACIÓN DE CONTRASEÑAS
# ---------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ---------------------------------------------------------------------------
# INTERNACIONALIZACIÓN
# ---------------------------------------------------------------------------
LANGUAGE_CODE = 'es-mx'   # Español México (afecta mensajes de error de Django)
TIME_ZONE = 'America/Monterrey'  # Zona horaria local
USE_I18N = True
USE_TZ = True             # Siempre guardar fechas con timezone (evita bugs de horario)

# ---------------------------------------------------------------------------
# ARCHIVOS ESTÁTICOS
# ---------------------------------------------------------------------------
STATIC_URL = 'static/'

# ---------------------------------------------------------------------------
# CLAVE PRIMARIA POR DEFECTO
# ---------------------------------------------------------------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ---------------------------------------------------------------------------
# SEGURIDAD EN PRODUCCIÓN (se activan cuando DEBUG=False)
# ---------------------------------------------------------------------------
if not DEBUG:
    # HTTPS — redirigir todo HTTP → HTTPS
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

    # HSTS — indicar al navegador que siempre use HTTPS
    SECURE_HSTS_SECONDS = 31536000       # 1 año
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

    # Cookies de sesión/CSRF seguras
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    # Protección contra clickjacking y XSS
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'
