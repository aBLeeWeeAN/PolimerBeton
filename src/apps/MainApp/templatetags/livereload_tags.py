import os
from django import template
from django.conf import settings

register = template.Library()

# Получаем имя модуля настроек
settings_module = os.environ.get("DJANGO_SETTINGS_MODULE")

# ? --- Заглушка на пакет django-livereload-server, которого нет в PRODUCTION режиме запуска!!!
# ? -------------------------------------------------------------------------------------------
if not settings.DEBUG or (
    settings_module and "config.settings.prod" in settings_module.lower()
):
    # Заглушки для продакшена
    @register.simple_tag
    def livereload():
        return ""

    @register.simple_tag
    def livereload_script():
        return ""
