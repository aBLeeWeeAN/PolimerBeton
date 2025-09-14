from django import template
from django.conf import settings

register = template.Library()


# ? --- Заглушка на пакет django-livereload-server, которого нет в PRODUCTION режиме запуска!!!
# ? -------------------------------------------------------------------------------------------
if not settings.DEBUG:
    # Заглушки для продакшена
    @register.simple_tag
    def livereload():
        return ""

    @register.simple_tag
    def livereload_script():
        return ""
