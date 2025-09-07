from django.utils import timezone
from django.db.models import Q

from asgiref.sync import sync_to_async
import asyncio

from .models import Client


async def reset_client_attempts_async():
    while True:
        await sync_to_async(reset_client_attempts)()
        await asyncio.sleep(3600)  # ? каждый час


def reset_client_attempts():
    now = timezone.now()

    # ? Фильтруем клиентов, которые либо заблокированы и время блокировки истекло,
    # ? либо не заблокированы и у них доступных попыток меньше 3
    Client.objects.filter(
        Q(blocked_until__isnull=False, blocked_until__lte=now)
        | Q(blocked_until__isnull=True, available_attempts__lt=3)
    ).update(available_attempts=3, blocked_until=None)
