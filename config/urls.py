from django.contrib import admin
from django.urls import include, path
from django.contrib.sitemaps.views import sitemap

from apps.MainApp.sitemaps import StaticViewSitemap

sitemaps = {
    "static": StaticViewSitemap,
}

urlpatterns = [
    path("admin/", admin.site.urls),
    # ? Подключаем маршруты из приложения MainApp
    path("", include("apps.MainApp.urls")),
    # ? Подключаем маршруты из приложения MetaPagesApp
    path("", include("apps.MetaPagesApp.urls")),
    path("sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="sitemap"),
]
