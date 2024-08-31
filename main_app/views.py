from django.shortcuts import render, redirect
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.crypto import get_random_string
from django.utils.html import strip_tags
from .forms import FeedbackForm
from decouple import config

from .models import Client, Request

import hashlib

# from htmlmin.decorators import minified_response

def generate_token():
    return get_random_string(64)


# @minified_response
def index(request):

    if request.method == 'POST':

        # Получаем токен из POST данных
        token = request.POST.get('form_token')
        # Проверяем токен
        if token != request.session.get('form_token'):
            # Токен не совпадает, это может быть повторная отправка
            return redirect('error')  # Или другое действие
        
        form = FeedbackForm(request.POST)
        if form.is_valid():
            # Получаем данные формы
            client_name = form.cleaned_data['client_name']
            client_phone = form.cleaned_data['client_phone']
            privacy_policy_agree = form.cleaned_data['privacy_policy']  # Согласие с политикой конфиденциальности
            
            client_phone_hash = hashlib.sha256(client_phone.encode()).hexdigest()

            # Создаем или получаем клиента по хэшу телефона
            client, created = Client.objects.get_or_create(
                phone_number_hash=client_phone_hash,
                defaults={
                    'last_name': 'нет фамилии',
                    'first_name': client_name,
                    'middle_name': 'нет отчества',
                    'phone_number': client_phone,
                    'privacy_policy_agree': privacy_policy_agree
                }
            )

            # Если клиент уже существовал, обновляем его согласие
            if not created:
                client.privacy_policy_agree = privacy_policy_agree
                client.save()

           # Создаем новый запрос для клиента
            request_number = client.requests.count() + 1
            request_instance = Request.objects.create(
                client_id=client,
                request_number=request_number
            )

           # Устанавливаем тему сообщения
            if created:
                subject = f'Заявка на звонок от нового клиента. ID клиента: №{client.client_id}'
            else:
                subject = f'Заявка на звонок от старого клиента. ID клиента: №{client.client_id}'

            from_email = config('EMAIL_HOST_USER')
            recipient_list = [config('EMAIL_RECIPIENT')]
            
            # Генерация HTML-сообщения
            html_message = render_to_string('email_service/email_message.html', {
                'client_name': client_name,
                'client_phone': client_phone,
                'client_id': client.client_id,
                'request_number': request_instance.request_number,
                'request_datetime': request_instance.request_datetime
            })
            
            plain_message = strip_tags(html_message)  # Текстовая версия сообщения

            # Создание и отправка письма
            email = EmailMultiAlternatives(subject, plain_message, from_email, recipient_list)
            email.attach_alternative(html_message, "text/html")
            email.send()

             # Устанавливаем метку, чтобы блокировать повторные отправки
            request.session['form_token'] = None  # Удаляем токен после использования
            return redirect('success')
    else:
        form_token = generate_token()
        request.session['form_token'] = form_token
        form = FeedbackForm()

    return render(request, 'main_app/index.html', {'form': form, 'form_token': form_token})

# @minified_response
def privacy(request):
    return render(request, 'main_app/privacy.html')

# @minified_response
def success(request):
    return render(request, 'main_app/success.html')