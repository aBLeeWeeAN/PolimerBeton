# import os
from pathlib import Path
from decouple import config


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

SECRET_KEY = config('DJANGO_SECRET_KEY', default='default-secret-key')


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['192.168.3.3', '127.0.0.1', 'localhost']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # django extensions
    'htmlmin',              # сжатие html
    'compressor',           # сжатие CSS и JS

    # my apps
    'main_app',
]

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
        'DIRS': [BASE_DIR / 'templates'],
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
        'NAME': BASE_DIR / 'db.sqlite3',
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
STATIC_ROOT = BASE_DIR / 'staticfiles'

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
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER


# database encryption key
FIELD_ENCRYPTION_KEY = config('FIELD_ENCRYPTION_KEY')
