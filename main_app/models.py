from django.utils.translation import gettext_lazy as _

from django.utils import timezone
from datetime import timedelta

from django.db import models
from encrypted_model_fields.fields import EncryptedCharField

import hashlib

class Client(models.Model):
    client_id = models.AutoField(primary_key=True, verbose_name=_('Client ID'))

    # Фамилия, имя, отчество
    last_name = EncryptedCharField(max_length=35, null=False, default='нет фамилии', verbose_name=_('Last name'))
    first_name = EncryptedCharField(max_length=35, null=False, default='нет имени', verbose_name=_('First name'))
    middle_name = EncryptedCharField(max_length=35, null=True, verbose_name=_('Middle name'))

    # Телефон
    phone_number = EncryptedCharField(max_length=18, null=False, default='нет телефона', verbose_name=_('Phone number'))

    # телефон шифруется разными хешами, так что этот хеш нужон чтобы отличать одинаковых клиентов
    phone_number_hash = models.CharField(max_length=64, unique=True, default='нет хэша телефона', verbose_name=_('Phone number hash'))                  

    # Согласие с политикой конфиденциальности
    privacy_policy_agree = models.BooleanField(null=False, default=False, verbose_name=_('The client agrees with the privacy policy'))

    # система блокировки пользователя, если спамит форму
    available_attempts = models.PositiveIntegerField(default=3, verbose_name=_('Available attempts'))  # Количество попыток отправки формы
    blocked_until = models.DateTimeField(null=True, blank=True, verbose_name=_('Blocked until'))  # Время блокировки

    def is_blocked(self):
        if self.blocked_until and timezone.now() < self.blocked_until:
            return True
        return False
    
    def reduce_available_attempts(self):
        self.available_attempts -= 1

        if self.available_attempts > 0:
            self.save()
            return
        
        self.block_this_client()

    def block_this_client(self):        
        self.blocked_until = timezone.now() + timedelta(hours=24)
        self.save()

    def unblock_and_reset_available_attempts(self):
        self.available_attempts = 3
        self.blocked_until = None
        self.save()

    def save(self, *args, **kwargs):
        # Создаем хэш для номера телефона
        if self.phone_number:
            self.phone_number_hash = hashlib.sha256(self.phone_number.encode()).hexdigest()
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'clients'
        verbose_name = _('Client')
        verbose_name_plural = _('Clients')

class Request(models.Model):
    request_id = models.AutoField(primary_key=True, verbose_name=_('Request ID'))

    # ID клиента
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='requests', verbose_name=_('Client ID'))

    # Номер обращения клиента (1, 2, 3, ..., N)
    request_number = models.PositiveIntegerField(null=False, default=1, verbose_name=_('Request number for this client'))

    # Дата и время данного обращения
    request_datetime = models.DateTimeField(auto_now_add=True, null=False, verbose_name=_('Date and time of registration for this request'))

    class Meta:
        db_table = 'requests'
        unique_together = ('client_id', 'request_number')
        verbose_name = _("Request")
        verbose_name_plural = _("Requests")
