from django.shortcuts import render, redirect
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .forms import FeedbackForm
from decouple import config

# from htmlmin.decorators import minified_response

# Create your views here.
# @minified_response
def index(request):
    if request.method == 'POST':
        form = FeedbackForm(request.POST)
        if form.is_valid():
            # Получаем данные формы
            client_name = form.cleaned_data['client_name']
            client_phone = form.cleaned_data['client_phone']
            
            # Составляем сообщение
            subject = 'Новое сообщение с сайта Polimerbeton-vrn.ru'
            from_email = config('EMAIL_HOST_USER')
            recipient_list = [config('EMAIL_RECIPIENT')]
            
            # Генерация HTML-сообщения
            html_message = render_to_string('email_service/email_message.html', {
                'client_name': client_name,
                'client_phone': client_phone,
            })
            plain_message = strip_tags(html_message)  # Текстовая версия сообщения

            # Создание и отправка письма
            email = EmailMultiAlternatives(subject, plain_message, from_email, recipient_list)
            email.attach_alternative(html_message, "text/html")
            email.send()

            # Перенаправление на страницу успешной отправки
            return redirect('success')
    else:
        form = FeedbackForm()

    return render(request, 'main_app/index.html', {'form': form})

# @minified_response
def privacy(request):
    return render(request, 'main_app/privacy.html')

# @minified_response
def success(request):
    return render(request, 'main_app/success.html')