from django.core.management.base import BaseCommand
from django_celery_beat.models import PeriodicTask, IntervalSchedule
import datetime

from main_app.tasks import reset_client_attempts

class Command(BaseCommand):
    help = 'Setup periodic tasks'

    def handle(self, *args, **kwargs):
        # Создание интервала в 10 секунд
        schedule, created = IntervalSchedule.objects.get_or_create(
            every=10,
            period=IntervalSchedule.SECONDS,
        )

        PeriodicTask.objects.get_or_create(
            interval=schedule,
            name='Reset client attempts every 10 seconds',
            task='main_app.tasks.reset_client_attempts',
        )

        self.stdout.write(self.style.SUCCESS('Successfully set up periodic tasks'))