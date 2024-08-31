from django.db import models
from django.utils.translation import gettext_lazy as _
from encrypted_model_fields.fields import EncryptedCharField, EncryptedBooleanField

class Client(models.Model):
    client_id = models.AutoField(primary_key=True, verbose_name=_('Client ID'))

    # Фамилия, имя, отчество
    last_name = EncryptedCharField(max_length=35, null=False, default='нет фамилии', verbose_name=_('Last Name'))
    first_name = EncryptedCharField(max_length=35, null=False, default='нет имени', verbose_name=_('First Name'))
    middle_name = EncryptedCharField(max_length=35, null=True, verbose_name=_('Middle Name'))

    # Телефон и согласие с политикой конфиденциальности
    phone_number = EncryptedCharField(max_length=18, unique=True, null=False, default='нет телефона', verbose_name=_('Phone'))
    privacy_policy_agree = EncryptedBooleanField(null=False, default=False, verbose_name=_('The client agrees with the privacy policy'))

    class Meta:
        db_table = 'clients'
        unique_together = ('phone_number',)
        verbose_name = _('Client')
        verbose_name_plural = _('Clients')

class Request(models.Model):
    request_id = models.AutoField(primary_key=True, verbose_name=_('Request ID'))

    # ID клиента
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='requests', verbose_name=_('Client ID'))

    # Номер обращения клиента (1, 2, 3, ..., N)
    request_number_for_this_client = models.PositiveIntegerField(null=False, default=0, verbose_name=_('Request number for this client'))

    # Дата и время данного обращения
    date_time_registration_for_this_request = models.DateTimeField(auto_now_add=True, null=False, verbose_name=_('Date and time of registration for this request'))

    class Meta:
        db_table = 'requests'
        unique_together = ('client_id', 'request_number_for_this_client')
        verbose_name = _("Request")
        verbose_name_plural = _("Requests")
