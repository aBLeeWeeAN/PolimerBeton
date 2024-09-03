from django.urls import path

from .views import RobotsTxtView
from .views import FeedTxtView


urlpatterns = [
    path("robots.txt", RobotsTxtView.as_view(content_type="text/plain"), name="robots"),
    path("feed.xml", FeedTxtView.as_view(content_type="application/xml"), name="feed"),
]