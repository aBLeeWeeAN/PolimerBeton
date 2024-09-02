from django.contrib import admin
from django.contrib.sites.models import Site

class SiteAdmin(admin.ModelAdmin):
    list_display = ('id', 'domain', 'name')  # Добавляем поле ID в список отображаемых полей

# Регистрируем модель Site с нашей кастомной админкой
admin.site.unregister(Site)  # Сначала нужно удалить стандартную регистрацию
admin.site.register(Site, SiteAdmin)  # Затем зарегистрировать её заново с кастомной админкой
