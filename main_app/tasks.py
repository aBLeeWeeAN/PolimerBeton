# from celery import shared_task
# from config.celery import app

from django.utils import timezone

from django.db.models import Q
from django.db import transaction

from asgiref.sync import sync_to_async

from .models import Client

import asyncio

# import logging

# Создаем экземпляр логгера
# logger = logging.getLogger(__name__)

# # @app.task(bind=True)
# def reset_client_attempts(self):
#     # with transaction.atomic():

#         # # Получаем текущее время в установленной временной зоне
#         # now = timezone.now()

#         # # Разблокируем всех клиентов, у которых истекло время блокировки или доступные попытки меньше 3
#         # Client.objects.filter(
#         #     Q(is_blocked=True, blocked_until__lte=now) | Q(is_blocked=False, available_attempts__lt=3)
#         # ).update(available_attempts=3, blocked_until=None)
        
#         # # Получаем всех клиентов из базы данных
#         # clients = Client.objects.all()
        
#         # # Перебираем каждого клиента
#         # for client in clients:

#         #     if client.is_blocked():
#         #         # Если клиент заблокирован и ещё не истекло, идём к следующему клиенту
#         #         if client.blocked_until > now:
#         #             continue

#         #         # Если время блокировки вышло, разблокируем клиента и ставим 3 попытки
#         #         client.unblock_and_reset_available_attempts()
#         #         client.save()
#         #     else:
#         #         # Если число попыток клиента < 3, ставим 3 попытки
#         #         if client.available_attempts < 3:
#         #             client.unblock_and_reset_available_attempts()
#         #             client.save()

#     # return f"{self}: \'reset_client_attempts\' task complete!"

async def reset_client_attempts_async():
    while True:
        await sync_to_async(reset_client_attempts)()
        await asyncio.sleep(3600)   # каждый час

def reset_client_attempts():
    now = timezone.now()

    # Фильтруем клиентов, которые либо заблокированы и время блокировки истекло,
    # либо не заблокированы и у них доступных попыток меньше 3
    Client.objects.filter(
        Q(blocked_until__isnull=False, blocked_until__lte=now) | Q(blocked_until__isnull=True, available_attempts__lt=3)
    ).update(available_attempts=3, blocked_until=None)

    # with transaction.atomic():
    # now = timezone.now()
    
    # clients = Client.objects.all()
    # for client in clients:
    #     if client.is_blocked():
    #         if client.blocked_until > now:
    #             continue
    #         client.unblock_and_reset_available_attempts()
    #     else:
    #         if client.available_attempts < 3:
    #             client.unblock_and_reset_available_attempts()