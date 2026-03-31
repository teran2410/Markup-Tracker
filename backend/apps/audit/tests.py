import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.audit.models import AuditLog

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
# AuditLog model
# =============================================
@pytest.mark.django_db
class TestAuditLogModel:
    def test_create_audit_log(self, user):
        log = AuditLog.objects.create(
            user=user,
            action=AuditLog.Action.CREATE,
            model_name='Markup',
            object_id=1,
            object_repr='MKP-001',
            changes={'titulo': [None, 'Test markup']},
        )
        assert log.pk is not None
        assert log.action == 'CREATE'
        assert 'titulo' in log.changes
        assert str(log) == f'Creación Markup#1 by {user}'

    def test_ordering_newest_first(self, user):
        AuditLog.objects.create(user=user, action='CREATE', model_name='A', object_id=1)
        AuditLog.objects.create(user=user, action='UPDATE', model_name='B', object_id=2)
        logs = list(AuditLog.objects.values_list('model_name', flat=True))
        assert logs == ['B', 'A']  # Newest first


# =============================================
# AuditLog API endpoint
# =============================================
@pytest.mark.django_db
class TestAuditLogAPI:
    def test_anon_cannot_access(self, api_client):
        resp = api_client.get('/api/audit-logs/')
        assert resp.status_code == 401

    def test_regular_user_forbidden(self, api_client, user):
        api_client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'TestPass123!',
        })
        resp = api_client.get('/api/audit-logs/')
        assert resp.status_code == 403

    def test_admin_can_access(self, api_client, admin_user):
        api_client.post('/api/auth/login/', {
            'username': 'admin_test',
            'password': 'AdminPass123!',
        })
        AuditLog.objects.create(
            user=admin_user, action='CREATE', model_name='Markup',
            object_id=1, object_repr='MKP-001',
        )
        resp = api_client.get('/api/audit-logs/')
        assert resp.status_code == 200
        assert resp.data['count'] >= 1
