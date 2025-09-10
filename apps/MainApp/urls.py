from django.urls import path
from . import views

from django.views.generic.base import TemplateView

urlpatterns = [
    # ? --- BASIC PAGES
    # ? ---------------
    path("", views.index, name="index"),
    path("privacy/", views.privacy, name="privacy"),
    path("success/", views.success, name="success"),
    path("error/", views.error, name="error"),
    # ? --- SERVICE PAGES
    # ? -----------------
    path(
        "robots.txt",
        TemplateView.as_view(
            template_name="service/robots.txt", content_type="text/plain"
        ),
        name="robots",
    ),
]
