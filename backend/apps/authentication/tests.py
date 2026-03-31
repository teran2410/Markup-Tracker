import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(username='testuser', password='TestPass123!')


@pytest.fixture
def admin_user(db):
    return User.objects.create_superuser(username='admin_test', password='AdminPass123!')


# =============================================
# Login
# =============================================
@pytest.mark.django_db
class TestLogin:
    def test_login_success(self, api_client, user):
        resp = api_client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'TestPass123!',
        })
        assert resp.status_code == 200
        assert resp.data['success'] is True
        assert 'access_token' in resp.cookies
        assert 'refresh_token' in resp.cookies
        assert resp.cookies['access_token']['httponly'] is True

    def test_login_bad_credentials(self, api_client, user):
        resp = api_client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'wrong',
        })
        assert resp.status_code == 401

    def test_login_missing_fields(self, api_client):
        resp = api_client.post('/api/auth/login/', {})
        assert resp.status_code == 400


# =============================================
# Refresh
# =============================================
@pytest.mark.django_db
class TestRefresh:
    def test_refresh_success(self, api_client, user):
        login_resp = api_client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'TestPass123!',
        })
        resp = api_client.post('/api/auth/refresh/')
        assert resp.status_code == 200
        assert resp.data['success'] is True
        assert 'access_token' in resp.cookies

    def test_refresh_without_cookie(self, api_client):
        resp = api_client.post('/api/auth/refresh/')
        assert resp.status_code == 401


# =============================================
# Me (current user)
# =============================================
@pytest.mark.django_db
class TestCurrentUser:
    def test_me_authenticated(self, api_client, user):
        api_client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'TestPass123!',
        })
        resp = api_client.get('/api/auth/me/')
        assert resp.status_code == 200
        assert resp.data['username'] == 'testuser'

    def test_me_unauthenticated(self, api_client):
        resp = api_client.get('/api/auth/me/')
        assert resp.status_code == 401


# =============================================
# Logout
# =============================================
@pytest.mark.django_db
class TestLogout:
    def test_logout_clears_cookies(self, api_client, user):
        api_client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'TestPass123!',
        })
        resp = api_client.post('/api/auth/logout/')
        assert resp.status_code == 200
        assert resp.cookies['access_token'].value == ''
        assert resp.cookies['refresh_token'].value == ''


# =============================================
# Protected endpoints require auth
# =============================================
@pytest.mark.django_db
class TestProtectedEndpoints:
    def test_markups_requires_auth(self, api_client):
        resp = api_client.get('/api/markups/')
        assert resp.status_code == 401

    def test_markups_with_auth(self, api_client, user):
        api_client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'TestPass123!',
        })
        resp = api_client.get('/api/markups/')
        assert resp.status_code == 200
