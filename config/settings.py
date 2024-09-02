from datetime import timedelta
import os

from pathlib import Path
from decouple import config


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

SECRET_KEY = config('DJANGO_SECRET_KEY')


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['polimerbeton-vrn.ru', '178.208.81.224', 'localhost', '192.168.3.3', '127.0.0.1']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django.contrib.sites',
    'django.contrib.sitemaps',

    # 'django_celery_beat',
    # 'django_celery_results',

    # django extensions
    'htmlmin',              # сжатие html
    'compressor',           # сжатие CSS и JS

    # my apps
    'main_app',
    'simple_pages_app',
]

# Получение SITE_ID из переменной окружения или файла .env и преобразование в целое число
SITE_ID = config('SITE_ID', default=1, cast=int)


# HTTPS/SSL settings
# SECURE_SSL_REDIRECT = True

# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True

# SECURE_HSTS_SECONDS = 31536000  # 1 год
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SECURE_HSTS_PRELOAD = True

# X_FRAME_OPTIONS = 'DENY'

# SECURE_CONTENT_TYPE_NOSNIFF = True
# SECURE_BROWSER_XSS_FILTER = True


# Caches
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://localhost:6379/1',
    }
}

SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'


# middlewares
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # 'django.middleware.gzip.GZipMiddleware',

    # django extensions mixins
    'htmlmin.middleware.MarkRequestMiddleware',
    'htmlmin.middleware.HtmlMinifyMiddleware',

    # my middleware mixins
    'main_app.middleware.cache_control_middleware.CacheControlMiddleware'

]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'ru'  # Устанавливаем язык по умолчанию на русский

USE_I18N = True  # Включение поддержки интернационализации
USE_L10N = True  # Включение локализации форматов

LOCALE_PATHS = [
    BASE_DIR / 'locale',  # Путь к каталогам с переводами
]


# Временная зона
TIME_ZONE = 'Europe/Moscow'
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

# URL для статических файлов
STATIC_URL = '/static/'

# Директория для сбора статических файлов
STATIC_ROOT = os.path.join(BASE_DIR, 'static_files')

# Дополнительные директории для поиска статических файлов
STATICFILES_DIRS = [
    # BASE_DIR / 'static',
    # ('node_modules', os.path.join(BASE_DIR, 'node_modules/')),
]


# Настройки htmlmin
HTML_MINIFY = True

HTMLMIN = {
    'remove_comments': True,
    'remove_empty_space': True,
    'remove_optional_attribute_quotes': False,
    'remove_empty_tags': True,
    'collapse_whitespace': True,
    'minify_js': True,
    'minify_css': True,
    'ignore': ['.no-minify'],
    'preprocessors': ['myapp.utils.preprocessor_function'],
}


# Настройки django-compressor
COMPRESS_ROOT = STATIC_ROOT
COMPRESS_URL = STATIC_URL

COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True # Для оффлайн-сжатия

COMPRESS_PRECOMPILERS = (
    ('text/x-sass', 'sass --scss {infile} {outfile}'),
)

COMPRESS_CSS_FILTERS = [
    'compressor.filters.css_default.CssAbsoluteFilter',
    'compressor.filters.cssmin.CSSMinFilter',
]

COMPRESS_JS_FILTERS = [
    'compressor.filters.jsmin.JSMinFilter',
]

# Включение finders для django-compressor
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',

    # other finders
    'compressor.finders.CompressorFinder',
]


# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# SMTP Yandex
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.yandex.ru'


# EMAIL_PORT = 587      # basic http
EMAIL_USE_TLS = False

EMAIL_PORT = 465        # for ssl (https)
EMAIL_USE_SSL = True

EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER


# database encryption key
FIELD_ENCRYPTION_KEY = config('FIELD_ENCRYPTION_KEY')


# Django logging
#LOGGING = {
#    'version': 1,                                   # Версия конфигурации логирования
#    'disable_existing_loggers': False,              # Не отключать существующих логеров
#    'formatters': {
#        'verbose': {
#            'format': '{levelname} {asctime} {module} {message}',
#            'style': '{',
#        },
#        'simple': {
#            'format': '{levelname} {message}',
#            'style': '{',
#        },
#    },
#    'handlers': {
#        'file': {
#            'level': 'ERROR',                                       # Минимальный уровень сообщений для записи в файл
#            'class': 'logging.FileHandler',                         # Используемый класс для обработки логов
#            'filename': os.path.join(BASE_DIR, 'errors.log'),       # Путь к файлу логов
#            'formatter': 'verbose',                                 # Форматирование сообщений
#        },
#        'console': {
#            'level': 'DEBUG',
#            'class': 'logging.StreamHandler',       # Вывод в консоль
#            'formatter': 'simple',                  # Форматирование сообщений
#        },
#    },
#    'loggers': {
#        'django': {
#            'handlers': ['file'],                   # Используемые обработчики для этого логера
#            'level': 'ERROR',                       # Минимальный уровень сообщений для этого логера
#            'propagate': True,                      # Сообщения должны передаваться дальше по цепочке логеров
#        },
#    },
#    'main_app': {                                   # Логер для вашего приложения
#        'handlers': ['console', 'file'],            # Используемые обработчики
#        'level': 'DEBUG',                           # Минимальный уровень сообщений
#        'propagate': False,                         # Не передавать сообщения дальше
#    },
#}


# Celery [ЗАЕБАЛО, ХУЙНЯ, НЕ РАБОТАЕТ]
# CELERY_TIMEZONE = 'Europe/Moscow'

# CELERY_BROKER_URL = 'redis://localhost:6379/0'

# CELERY_RESULT_BACKEND = 'django-db'
# CELERY_RESULT_EXTENDED = True

# CELERY_BEAT_SCHEDULE = {
#     'reset-client-attempts-every-30-seconds': {
#         'task': 'main_app.tasks.reset_client_attempts',
#         'schedule': timedelta(seconds=30),
#     },
# }

# CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

# CELERY_ACCEPT_CONTENT = ['json']
# CELERY_TASK_SERIALIZER = 'json'
# CELERY_RESULT_SERIALIZER = 'json'

# CELERY_TASK_ACKS_LATE = True                # Подтверждение выполнения задач после завершения
# CELERY_TASK_REJECT_ON_WORKER_LOST = True    # Перемещать задачи, если работник теряется
# CELERY_WORKER_CONCURRENCY = 4               # Количество потоков на одного работника