from django.shortcuts import render, redirect
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from django.utils.crypto import get_random_string
from django.utils.html import strip_tags
from django.utils import timezone

from .forms import FeedbackForm

# from decouple import config

from .models import Client, Request

import hashlib
from babel.dates import format_datetime

from django.conf import settings

# from django.http import HttpResponse
# from htmlmin.decorators import minified_response

from mailjet_rest import Client as MailjetClient

import logging

logger = logging.getLogger(__name__)


def generate_token():
    return get_random_string(64)


# @minified_response
def index(request):

    if request.method == "POST":

        # Получаем токен из POST данных
        token = request.POST.get("form_token")
        # Проверяем токен
        if token != request.session.get("form_token"):
            # Токен не совпадает, это может быть повторная отправка
            m_error_h1 = "Упс! Что-то пошло не так!"
            m_error_h2 = "Неверный токен, попробуйте перезагрузить страницу!"

            request.session["error_h1"] = m_error_h1
            request.session["error_h2"] = m_error_h2
            return redirect("error")

        form = FeedbackForm(request.POST)
        if form.is_valid():
            # Получаем данные формы
            client_name = form.cleaned_data["client_name"]
            client_phone = form.cleaned_data["client_phone"]
            privacy_policy_agree = form.cleaned_data[
                "privacy_policy"
            ]  # Согласие с политикой конфиденциальности

            client_phone_hash = hashlib.sha256(client_phone.encode()).hexdigest()

            # Создаем или получаем клиента по хэшу телефона
            client, created = Client.objects.get_or_create(
                phone_number_hash=client_phone_hash,
                defaults={
                    "last_name": "нет фамилии",
                    "first_name": client_name,
                    "middle_name": "нет отчества",
                    "phone_number": client_phone,
                    "privacy_policy_agree": privacy_policy_agree,
                },
            )

            if client.is_blocked():
                # Проверяем, истекло ли время блокировки
                if timezone.now() >= client.blocked_until:
                    # Если время блокировки истекло, разблокируем клиента и сбрасываем попытки
                    client.unblock_and_reset_available_attempts()
                else:
                    # unblock_time = client.blocked_until.strftime("%d %B %Y %H:%M:%S")
                    unblock_time = format_datetime(
                        client.blocked_until, "d MMMM yyyy HH:mm:ss", locale="ru"
                    )

                    m_error_h1 = "Слишком много попыток!"
                    m_error_h2 = f"Мы приняли Вашу предыдущую контактную информацию и используем её для связи с Вами! Если Вы хотите обновить свою контактную информацию, Вы сможете сделать это после: {unblock_time}"

                    request.session["error_h1"] = m_error_h1
                    request.session["error_h2"] = m_error_h2
                    return redirect("error")

            if created:
                m_message_h1 = "Ваша контактная информация успешно отправлена!"
                m_message_h2 = (
                    "В ближайшее время мы свяжемся с Вами для уточнения деталей заказа!"
                )
            else:
                # Обновляем имя и другие поля клиента, если он уже существует
                client.first_name = client_name
                client.privacy_policy_agree = privacy_policy_agree
                client.save()

                m_message_h1 = "Вы успешно обновили свою контактную информацию!"
                m_message_h2 = (
                    "В ближайшее время мы свяжемся с Вами для уточнения деталей заказа!"
                )

            client.reduce_available_attempts()

            # # Если клиент уже существовал, обновляем его согласие
            # if not created:
            #     client.privacy_policy_agree = privacy_policy_agree
            #     client.save()

            # Создаем новый запрос для клиента
            request_number = client.requests.count() + 1
            request_instance = Request.objects.create(
                client_id=client, request_number=request_number
            )

            # Устанавливаем тему сообщения
            subject = f'Заявка на звонок от {"нового" if created else "существующего"} клиента. ID клиента: №{client.client_id}'
            # if created:
            #     subject = f'Заявка на звонок от нового клиента. ID клиента: №{client.client_id}'
            # else:
            #     subject = f'Заявка на звонок от старого клиента. ID клиента: №{client.client_id}'

            # Форматируем дату с помощью Babel
            formatted_datetime = format_datetime(
                request_instance.request_datetime, "d MMMM yyyy HH:mm:ss", locale="ru"
            )

            # ? Генерация HTML-сообщения для отправки по Email
            html_message = render_to_string(
                "email/message_template.html",
                {
                    "client_name": client_name,
                    "client_phone": client_phone,
                    "client_id": client.client_id,
                    "request_number": request_instance.request_number,
                    "request_datetime": formatted_datetime,
                },
            )

            plain_message = strip_tags(html_message)  # Текстовая версия сообщения

            if settings.USE_DJANGO_SMTP_SERVER:
                # ? Создание и отправка письма
                from_email = f"PolimerBeton Bot <{settings.SENDER_EMAIL}>"
                recipient_list = [settings.RECIPIENT_EMAIL]

                email = EmailMultiAlternatives(
                    subject, plain_message, from_email, recipient_list
                )
                email.attach_alternative(html_message, "text/html")

                try:
                    email.send()
                except Exception as e:
                    logger.error(f"Ошибка при отправке письма: {e}")

                    m_error_h1 = "Ошибка при отправке данных!"
                    m_error_h2 = f'К сожалению при отправе формы произошла ошибка! Но не беда! Вы всё ещё можете написать нам напрямую на нашу почту "Polimerbeton-vrn@yandex.ru" или связаться с нами по телефону "8 920 226 16 66".'

                    request.session["error_h1"] = m_error_h1
                    request.session["error_h2"] = m_error_h2

                    return redirect("error")

            if settings.USE_MAILJET_HTTP_SERVER:
                api_key = settings.MAILJET_APIKEY_PUBLIC
                api_key_secret = settings.MAILJET_APIKEY_PRIVATE

                mailjet = MailjetClient(auth=(api_key, api_key_secret), version="v3.1")
                data = {
                    "Messages": [
                        {
                            "From": {
                                "Email": settings.SENDER_EMAIL,
                                "Name": f"Polimerbeton Bot",
                            },
                            "To": [
                                {"Email": settings.RECIPIENT_EMAIL},
                                # ? second recipient (if necessary)
                                # {
                                #     "Email": settings.RECIPIENT_EMAIL,
                                #     "Name": "Polimerbeton Bot",
                                # },
                            ],
                            "Subject": subject,
                            "TextPart": plain_message,
                            "HTMLPart": html_message,
                        }
                    ]
                }

                result = mailjet.send.create(data=data)
                status_code = result.status_code
                json_resp = result.json

                if status_code in (200, 201):
                    logger.info(f"Удачная отправка Mailjet: {json_resp}")
                else:
                    logger.error(
                        f"Ошибка отправки Mailjet ({status_code}): {json_resp}"
                    )

                    m_error_h1 = f"Ошибка {status_code} при отправке данных!"
                    m_error_h2 = f'К сожалению при отправе формы произошла ошибка! Но не беда! Вы всё ещё можете написать нам напрямую на нашу почту "Polimerbeton-vrn@yandex.ru" или связаться с нами по телефону "8 920 226 16 66".'

                    request.session["error_h1"] = m_error_h1
                    request.session["error_h2"] = m_error_h2

                    return redirect("error")

            # Устанавливаем метку, чтобы блокировать повторные отправки
            request.session["form_token"] = None  # Удаляем токен после использования

            request.session["message_h1"] = m_message_h1
            request.session["message_h2"] = m_message_h2

            return redirect("success")
    else:
        form_token = generate_token()
        request.session["form_token"] = form_token
        form = FeedbackForm()

    # Генерация HTTP ссылки
    http_image_url = (
        "http://"
        + request.get_host()
        + settings.STATIC_URL
        + "MainApp/images/open_graph/large_image_home.jpg"
    )

    # Генерация HTTPS ссылки
    https_image_url = (
        "https://"
        + request.get_host()
        + settings.STATIC_URL
        + "MainApp/images/open_graph/large_image_home.jpg"
    )

    # Генерация абсолютной ссылки для изображения Twitter Cards
    absolute_url_for_twitter_thumbnail_image = request.build_absolute_uri(
        settings.STATIC_URL + "MainApp/images/twitter/thumbnail_image.jpg"
    )

    # reset_client_attempts()
    return render(
        request,
        "MainApp/index.html",
        {
            "form": form,
            "form_token": form_token,
            "http_image_url": http_image_url,
            "https_image_url": https_image_url,
            "twitter_thumbnail_image_url": absolute_url_for_twitter_thumbnail_image,
        },
    )


# @minified_response
def privacy(request):
    # Генерация HTTP ссылки
    http_image_url = (
        "http://"
        + request.get_host()
        + settings.STATIC_URL
        + "MainApp/images/open_graph/large_image_privacy.jpg"
    )

    # Генерация HTTPS ссылки
    https_image_url = (
        "https://"
        + request.get_host()
        + settings.STATIC_URL
        + "MainApp/images/open_graph/large_image_privacy.jpg"
    )

    # Генерация абсолютной ссылки для изображения Twitter Cards
    absolute_url_for_twitter_thumbnail_image = request.build_absolute_uri(
        settings.STATIC_URL + "MainApp/images/twitter/thumbnail_image.jpg"
    )

    return render(
        request,
        "MainApp/privacy.html",
        {
            "http_image_url": http_image_url,
            "https_image_url": https_image_url,
            "twitter_thumbnail_image_url": absolute_url_for_twitter_thumbnail_image,
        },
    )


# from .tasks import reset_client_attempts


# @minified_response
def success(request):
    message_h1 = request.session.get(
        "message_h1",
        "Шаблон страницы информирования об успешной отправке контактных данных через форму!",
    )
    message_h2 = request.session.get(
        "message_h2", "А Вы любознательный, раз нашли эту пасхалку! (´｡• ω •｡`)"
    )

    # Очистите сообщения после использования
    request.session.pop("message_h1", None)
    request.session.pop("message_h2", None)

    # Генерация HTTP ссылки
    http_image_url = (
        "http://"
        + request.get_host()
        + settings.STATIC_URL
        + "MainApp/images/open_graph/large_image_success.jpg"
    )

    # Генерация HTTPS ссылки
    https_image_url = (
        "https://"
        + request.get_host()
        + settings.STATIC_URL
        + "MainApp/images/open_graph/large_image_success.jpg"
    )

    # Генерация абсолютной ссылки для изображения Twitter Cards
    absolute_url_for_twitter_thumbnail_image = request.build_absolute_uri(
        settings.STATIC_URL + "MainApp/images/twitter/thumbnail_image.jpg"
    )

    return render(
        request,
        "MainApp/success.html",
        {
            "message_h1": message_h1,
            "message_h2": message_h2,
            "http_image_url": http_image_url,
            "https_image_url": https_image_url,
            "twitter_thumbnail_image_url": absolute_url_for_twitter_thumbnail_image,
        },
    )


def error(request):
    error_h1 = request.session.get(
        "error_h1",
        "Шаблон страницы информирования о неудачной отправке контактных данных через форму!",
    )
    error_h2 = request.session.get(
        "error_h2",
        "Да, это пасхалка №2 - держите поздравления от разработчика! (╯✧▽✧)╯",
    )

    # Очистите сообщения после использования
    request.session.pop("error_h1", None)
    request.session.pop("error_h2", None)

    # Генерация HTTP ссылки
    http_image_url = (
        "http://"
        + request.get_host()
        + settings.STATIC_URL
        + "MainApp/images/open_graph/large_image_error.jpg"
    )

    # Генерация HTTPS ссылки
    https_image_url = (
        "https://"
        + request.get_host()
        + settings.STATIC_URL
        + "MainApp/images/open_graph/large_image_error.jpg"
    )

    # Генерация абсолютной ссылки для изображения Twitter Cards
    absolute_url_for_twitter_thumbnail_image = request.build_absolute_uri(
        settings.STATIC_URL + "MainApp/images/twitter/thumbnail_image.jpg"
    )

    return render(
        request,
        "MainApp/error.html",
        {
            "error_h1": error_h1,
            "error_h2": error_h2,
            "http_image_url": http_image_url,
            "https_image_url": https_image_url,
            "twitter_thumbnail_image_url": absolute_url_for_twitter_thumbnail_image,
        },
    )


# ? --- FAVICON.ICO
# ? ---------------
# from django.conf import settings
# from django.http import FileResponse, HttpRequest, HttpResponse
# from django.views.decorators.cache import cache_control
# from django.views.decorators.http import require_GET


# @require_GET
# @cache_control(max_age=60 * 60 * 24, immutable=True, public=True)  # one day
# def favicon_file(request: HttpRequest) -> HttpResponse:
#     name = request.path.lstrip("/")
#     file = (settings.BASE_DIR / "apps" / "MainApp" / "static" / "favicons" / name).open(
#         "rb"
#     )
#     return FileResponse(file)
