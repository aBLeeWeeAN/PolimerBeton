from django.utils.translation import gettext_lazy as _

from django.contrib import admin
from django.contrib.admin.models import LogEntry

from .models import Client, Request

from django.db.models import Q
import hashlib


@admin.register(LogEntry)
class LogEntryAdmin(admin.ModelAdmin):
    list_display = ('action_time', 'user', 'content_type', 'object_id', 'object_repr', 'action_flag', 'change_message')
    list_filter = ('action_time', 'user', 'content_type', 'action_flag')
    search_fields = ('object_repr', 'change_message')
    ordering = ('-action_time',)  # Сортировать по времени действия в убывающем порядке

    def get_action_flag_display(self, obj):
        return obj.get_action_flag_display()
    get_action_flag_display.short_description = _('Action Type')


class RequestInline(admin.TabularInline):
    model = Request
    extra = 0  # Убирает пустые строки для создания новых запросов
    readonly_fields = ('request_id', 'request_number', 'request_datetime')
    can_delete = False  # Убирает возможность удаления запросов через инлайн
    ordering = ('-request_datetime',)  # Сортировка по дате и времени, начиная с последнего

    def has_add_permission(self, request, obj=None):
        return False

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        'client_id', 'last_name', 'first_name', 'middle_name',
        'phone_number', 'phone_number_hash', 'privacy_policy_agree',
        'available_attempts', 'blocked_until', 'is_unblocked_admin'
    )
    search_fields = (
        'client_id', 'phone_number', 'phone_number_hash',
    )
    list_filter = ('privacy_policy_agree',)
    ordering = ('-client_id',)
    readonly_fields = ('client_id', 'is_unblocked_admin')

    inlines = [RequestInline]  # Добавляем инлайн для запросов

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Если редактируется существующий объект
            return self.readonly_fields + ('phone_number', 'phone_number_hash', 'available_attempts', 'blocked_until')
        return self.readonly_fields
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Если редактируется существующий объект
            return self.readonly_fields + ('phone_number', 'phone_number_hash')
        return self.readonly_fields

    def get_search_results(self, request, queryset, search_term):
        # Убедитесь, что поисковый термин является строкой
        search_term = str(search_term).strip()

        # Проверка на client_id
        if search_term.isdigit():
            queryset = queryset.filter(Q(client_id=search_term))
            return queryset, False

        # Проверка на хэш
        if self.is_hash(search_term):
            queryset = queryset.filter(Q(phone_number_hash=search_term))
            return queryset, False

        # Проверка на номер телефона
        if self.is_phone_number_format(search_term):
            search_term_hash = hashlib.sha256(search_term.encode()).hexdigest()
            queryset = queryset.filter(Q(phone_number_hash=search_term_hash))
            return queryset, False

        # Поиск по другим полям
        queryset = queryset.filter(
            Q(last_name__icontains=search_term) |
            Q(first_name__icontains=search_term)
        )
        
        return queryset, False

    def is_hash(self, value):
        # Определяем, является ли значение хэшем
        return len(value) == 64 and all(c in '0123456789abcdef' for c in value)

    def is_phone_number_format(self, value):
        # Определяем, является ли значение форматом номера телефона
        return any(char in value for char in "+()- ")
    
    def is_unblocked_admin(self, obj):
        return not obj.is_blocked()
    
    is_unblocked_admin.boolean = True  # Отображение статуса как галочки
    is_unblocked_admin.short_description = _('Active')  # Название колонки


# class ClientPhoneFilter(admin.SimpleListFilter):
#     title = _('Client phone number')
#     parameter_name = 'client_phone'

#     def lookups(self, request, model_admin):
#         # Получаем уникальные номера телефонов клиентов для фильтра
#         phones = set(Client.objects.values_list('phone_number', flat=True))
#         return [(phone, phone) for phone in phones]

#     def queryset(self, request, queryset):
#         if self.value():
#             # Фильтруем заявки по номеру телефона клиента
#             return queryset.filter(client_id__phone_number=self.value())
#         return queryset

@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = (
        'request_id', 'get_client_phone', 'get_client_name', 'request_number', 'request_datetime'
    )
    search_fields = (
        'request_id',
        'client_id__phone_number_hash'  # Исправленный поиск по полю хэша
    )
    list_filter = ('request_datetime',)
    ordering = ('-request_datetime',)
    readonly_fields = ('request_id', 'request_datetime')

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields
        return self.readonly_fields

    def get_client_phone(self, obj):
        return obj.client_id.phone_number
    get_client_phone.short_description = _('Client phone number')  # Заголовок колонки

    def get_client_name(self, obj):
        # return f"{obj.client_id.first_name} {obj.client_id.last_name}"
        return f"{obj.client_id.first_name}"
    get_client_name.short_description = _('Client name')  # Заголовок колонки

    def get_search_results(self, request, queryset, search_term):
        search_term = str(search_term).strip()

        # Проверка на request_id
        if search_term.isdigit():
            queryset = queryset.filter(Q(request_id=search_term))
            return queryset, False

        # Проверка на хэш номера телефона
        if self.is_hash(search_term):
            queryset = queryset.filter(Q(client_id__phone_number_hash=search_term))
            return queryset, False

        # Проверка на номер телефона
        if self.is_phone_number_format(search_term):
            search_term_hash = hashlib.sha256(search_term.encode()).hexdigest()
            queryset = queryset.filter(Q(client_id__phone_number_hash=search_term_hash))
            return queryset, False

        # Поиск по request_id
        queryset = queryset.filter(
            Q(request_id__icontains=search_term)
        )

        return queryset, False

    def is_hash(self, value):
        # Определяем, является ли значение хэшем
        return len(value) == 64 and all(c in '0123456789abcdef' for c in value)

    def is_phone_number_format(self, value):
        # Определяем, является ли значение форматом номера телефона
        return any(char in value for char in "+()- ")