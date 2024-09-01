from django.utils.cache import patch_cache_control
from django.utils.deprecation import MiddlewareMixin

class CacheControlMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # Проверяем, относится ли запрос к статическим файлам или медиа
        if request.path.startswith('/static/') or request.path.startswith('/media/'):
            # Устанавливаем заголовок Cache-Control на 30 дней
            # patch_cache_control(response, public=True, max_age=2592000)
            patch_cache_control(response, public=True, max_age=31536000)
        return response