from django.contrib import admin
from .models import Client, Request

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('client_id', 'last_name', 'first_name', 'middle_name', 'phone_number', 'privacy_policy_agree')
    search_fields = ('last_name', 'first_name', 'phone_number')
    list_filter = ('privacy_policy_agree',)
    ordering = ('-client_id',)
    readonly_fields = ('client_id',)

@admin.register(Request)
class requestAdmin(admin.ModelAdmin):
    list_display = ('request_id', 'client_id', 'request_number_for_this_client', 'date_time_registration_for_this_request')
    search_fields = ('client_id__phone_number', 'request_number_for_this_client')
    list_filter = ('date_time_registration_for_this_request',)
    ordering = ('-date_time_registration_for_this_request',)
    readonly_fields = ('request_id', 'date_time_registration_for_this_request')