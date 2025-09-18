from django.apps import AppConfig


class MainAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.MainApp"

    def ready(self):
        from .runners import start_task_runner
        from django.db.models.signals import post_migrate

        post_migrate.connect(lambda **kwargs: start_task_runner())
        # start_task_runner()
