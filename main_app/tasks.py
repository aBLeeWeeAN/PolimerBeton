from celery import shared_task

from django.utils import timezone
from .models import Client

@shared_task
def reset_client_attempts():
    # Получаем текущее время в установленной временной зоне
    now = timezone.now()
    
    # Получаем всех клиентов из базы данных
    clients = Client.objects.all()
    
    # Перебираем каждого клиента
    for client in clients:

        if client.is_blocked():
            # Если клиент заблокирован и ещё не истекло, идём к следующему клиенту
            if client.blocked_until > now:
                continue

            # Если время блокировки вышло, разблокируем клиента и ставим 3 попытки
            client.unblock_and_reset_available_attempts()
        else:
            # Если число попыток клиента < 3, ставим 3 попытки
            if client.available_attempts < 3:
                client.unblock_and_reset_available_attempts()

    return "\'reset_client_attempts\' task complete!"