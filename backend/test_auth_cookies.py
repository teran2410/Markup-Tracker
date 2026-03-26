r"""
Script de prueba para verificar que el sistema de autenticación con cookies funciona.

Uso:
    cd backend
    .\venv\Scripts\Activate
    python test_auth_cookies.py
"""

import requests

BASE_URL = "http://localhost:8000"

def test_login():
    """Prueba el endpoint de login"""
    print("\n🔐 Probando login...")
    
    response = requests.post(
        f"{BASE_URL}/api/auth/login/",
        json={
            "username": "admin",
            "password": "admin123"
        }
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print(f"\n🍪 Cookies recibidas:")
    for cookie_name, cookie_value in response.cookies.items():
        print(f"  - {cookie_name}: {cookie_value[:50]}...")
    
    if response.status_code == 200:
        print("✅ Login exitoso")
        return response.cookies
    else:
        print("❌ Login falló")
        return None

def test_current_user(cookies):
    """Prueba el endpoint /auth/me/ con las cookies"""
    print("\n👤 Probando obtener usuario actual...")
    
    response = requests.get(
        f"{BASE_URL}/api/auth/me/",
        cookies=cookies
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print(f"Response: {response.json()}")
        print("✅ Usuario autenticado correctamente")
        return True
    else:
        print(f"Response: {response.text}")
        print("❌ Autenticación falló")
        return False

def test_refresh(cookies):
    """Prueba el endpoint de refresh"""
    print("\n🔄 Probando refresh token...")
    
    response = requests.post(
        f"{BASE_URL}/api/auth/refresh/",
        cookies=cookies
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Refresh exitoso")
        return response.cookies
    else:
        print(f"Response: {response.text}")
        print("❌ Refresh falló")
        return None

def test_logout(cookies):
    """Prueba el endpoint de logout"""
    print("\n🚪 Probando logout...")
    
    response = requests.post(
        f"{BASE_URL}/api/auth/logout/",
        cookies=cookies
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Logout exitoso")
        return True
    else:
        print(f"Response: {response.text}")
        print("❌ Logout falló")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 TEST DE AUTENTICACIÓN CON COOKIES")
    print("=" * 60)
    
    # 1. Login
    cookies = test_login()
    if not cookies:
        print("\n❌ No se pudo continuar con las pruebas")
        exit(1)
    
    # 2. Verificar autenticación
    if not test_current_user(cookies):
        print("\n❌ No se pudo continuar con las pruebas")
        exit(1)
    
    # 3. Refresh
    new_cookies = test_refresh(cookies)
    if new_cookies:
        cookies = new_cookies
    
    # 4. Logout
    test_logout(cookies)
    
    print("\n" + "=" * 60)
    print("✅ TODAS LAS PRUEBAS COMPLETADAS")
    print("=" * 60)
