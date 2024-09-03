from http import HTTPStatus
from django.test import SimpleTestCase


class RobotsTxtTests(SimpleTestCase):
    def test_get(self):
        response = self.client.get("/robots.txt")

        assert response.status_code == HTTPStatus.OK
        assert response["content-type"] == "text/plain"

class FeedTxtTests(SimpleTestCase):
    def test_get(self):
        response = self.client.get("/feed.xml")

        assert response.status_code == HTTPStatus.OK
        assert response["content-type"] == "application/xml"