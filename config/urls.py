from django.contrib import admin
from django.urls import include, path
from django.contrib.sitemaps.views import sitemap

from main_app.sitemaps import StaticViewSitemap

sitemaps = {
    'static': StaticViewSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('', include('main_app.urls')),             # Подключаем маршруты из приложения main_app
    path('', include("simple_pages_app.urls")),     # Подключаем маршруты из приложения simple_pages_app

    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),
]