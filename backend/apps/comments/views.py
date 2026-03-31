from rest_framework import viewsets
from .models import Comentario
from .serializers import ComentarioSerializer
from apps.core.permissions import IsCommentOwnerOrAdmin


class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer
    permission_classes = [IsCommentOwnerOrAdmin]

    # Filtrar comentarios por Markup
    def get_queryset(self):
        queryset = Comentario.objects.all()
        markup_id = self.request.query_params.get('markup')
        if markup_id:
            queryset = queryset.filter(markup_id=markup_id)
        return queryset