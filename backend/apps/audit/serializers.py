from rest_framework import serializers
from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    user_display = serializers.SerializerMethodField()
    action_display = serializers.CharField(source='get_action_display', read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_display', 'action', 'action_display',
            'model_name', 'object_id', 'object_repr',
            'changes', 'ip_address', 'timestamp',
        ]
        read_only_fields = fields

    def get_user_display(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return 'Sistema'
