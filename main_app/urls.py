from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('privacy/', views.privacy, name='privacy'),
    path('success/', views.success, name='success'),
    path('error/', views.error, name='error'),

    # path('favicons/browserconfig.xml', views.browserconfig_xml, name='browserconfig_xml'),
]