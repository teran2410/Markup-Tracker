from .signals import set_current_request


class AuditMiddleware:
    """Inyecta user e IP del request actual en thread-locals para los signals de auditoría."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        set_current_request(request)
        return self.get_response(request)
