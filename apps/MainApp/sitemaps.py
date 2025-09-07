from django.contrib.sitemaps import Sitemap
from django.urls import reverse


class StaticViewSitemap(Sitemap):
    protocol = "https"
    changefreq = "monthly"

    # Страницы сайта
    def items(self):
        return [
            "index",
            "privacy",
            "success",
            "error",
        ]

    def location(self, item):
        return reverse(item)

    def priority(self, item):

        # Устанавливаем разные приоритеты для каждой страницы
        if item == "index":
            return 1.0
        elif item == "privacy":
            return 0.8
        elif item == "success":
            return 0.0
        elif item == "error":
            return 0.0

        # Приоритет по умолчанию
        return 0.5
