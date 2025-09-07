# import os
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config("DJANGO_SECRET_KEY", default="secret_key_for_dummy_guys")

DEBUG = config("DJANGO_DEBUG", default=True, cast=bool)

DEFAULT_DOMAIN = "polimerbeton-vrn.ru"

ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS", default="127.0.0.1,localhost").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # ? --- ?????
    # ? ---------
    "django.contrib.sites",
    "django.contrib.sitemaps",
    # ? --- HTML, CSS и JS сжатие
    # ? -------------------------
    "htmlmin",
    "compressor",
    # ? --- MY APPS
    # ? -----------
    "apps.MainApp",
    "apps.MetaPagesApp",
]

# TODO: delete SITE_ID?
SITE_ID = config("SITE_ID", default=1, cast=int)

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # ? --- HTML сжатие
    # ? ---------------
    "htmlmin.middleware.MarkRequestMiddleware",
    "htmlmin.middleware.HtmlMinifyMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ? --- PASSWORD VALIDATION
# ? -----------------------
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# ? --- i18n / l10n
# ? ---------------
LANGUAGE_CODE = "ru"  # Устанавливаем язык по умолчанию на русский
TIME_ZONE = "Europe/Moscow"
USE_I18N = True
USE_TZ = True
LOCALE_PATHS = [BASE_DIR / "locales"]
#! USE_L10N = True

# ? --- STATIC FILES
# ? ----------------
STATIC_URL = "/static_assets/"
STATIC_ROOT = BASE_DIR / "static_assets"
STATICFILES_DIRS = [
    # ? find only '/static/' folders in apps
]
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
    "compressor.finders.CompressorFinder",
]
STATICFILES_STORAGE = "django.contrib.staticfiles.storage.ManifestStaticFilesStorage"

# ? --- COMPRESSOR
# ? --------------
COMPRESS_ROOT = STATIC_ROOT
COMPRESS_URL = STATIC_URL
COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True
COMPRESS_CSS_FILTERS = [
    "compressor.filters.css_default.CssAbsoluteFilter",
    "compressor.filters.cssmin.CSSMinFilter",
]
COMPRESS_JS_FILTERS = [
    "compressor.filters.jsmin.JSMinFilter",
]

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ? --- EMAIL SETTINGS
# ? ------------------
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.yandex.ru"
EMAIL_PORT = 465
EMAIL_USE_SSL = True
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="email_address_for_dummy_guys")
EMAIL_HOST_PASSWORD = config(
    "EMAIL_HOST_PASSWORD", default="email_password_for_dummy_guys"
)
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
#! EMAIL_USE_TLS = False

# ? --- ENCRYPTION
# ? --------------
FIELD_ENCRYPTION_KEY = config(
    "FIELD_ENCRYPTION_KEY", default="field_encryption_key_for_dummy_guys"
)

# ? --- REDIS CACHE
# ? ---------------
# CACHES = {
#     "default": {
#         "BACKEND": "django.core.cache.backends.redis.RedisCache",
#         "LOCATION": "redis://localhost:6379/1",
#     }
# }

# SESSION_ENGINE = "django.contrib.sessions.backends.cache"
# SESSION_CACHE_ALIAS = "default"
