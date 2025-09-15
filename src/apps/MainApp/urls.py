from django.views.generic.base import TemplateView, RedirectView
from django.conf import settings
from django.urls import path

from . import views


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
    # path(
    #     "favicon.ico",
    #     RedirectView.as_view(
    #         url=settings.STATIC_URL + "favicons/favicon.ico", permanent=True
    #     ),
    # ),
]
