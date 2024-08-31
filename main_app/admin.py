from django.contrib import admin
from .models import Client, Request

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        'client_id', 'last_name', 'first_name', 'middle_name',
        'phone_number', 'phone_number_hash', 'privacy_policy_agree'
    )
    search_fields = (
        'last_name', 'first_name', 'phone_number', 'phone_number_hash'
    )
    list_filter = ('privacy_policy_agree',)
    ordering = ('-client_id',)
    readonly_fields = ('client_id', 'phone_number_hash')

    # Optionally, if you want to make phone_number and phone_number_hash read-only
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('phone_number', 'phone_number_hash')
        return self.readonly_fields

@admin.register(Request)
class requestAdmin(admin.ModelAdmin):
    list_display = (
        'request_id', 'client_id', 'request_number', 'request_datetime'
    )
    search_fields = ('client__phone_number', 'client__last_name', 'client__first_name', 'request_number')
    list_filter = ('request_datetime',)
    ordering = ('-request_datetime',)
    readonly_fields = ('request_id', 'request_datetime')

    # Optionally, if you want to make request_id and date_time_registration read-only
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields
        return self.readonly_fields