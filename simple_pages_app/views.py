from django.views.generic import TemplateView


# Create your views here.
class RobotsTxtView(TemplateView):
    template_name = "robots.txt"