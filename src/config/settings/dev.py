from .base import *
from decouple import config
import base64

# ? --- SECRET KEY SETTINGS
# ? -----------------------
SECRET_KEY = config("DJANGO_SECRET_KEY", default="secret_key_for_dummy_guys")

# ? --- Debug settings
# ? ------------------
DEBUG = config("DJANGO_DEBUG", default=True, cast=bool)

if DEBUG:
    INSTALLED_APPS += [
        # ? --- LIVE RELOAD
        # ? ---------------
        "livereload",
    ]

    MIDDLEWARE += [
        # ? --- LIVE RELOAD
        # ? ---------------
        "livereload.middleware.LiveReloadScript",
    ]

# ? --- Allowed hosts
# ? -----------------
ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS", default="127.0.0.1,localhost").split(",")

# ? --- Need for sitemap.xml
# ? ------------------------
SITE_ID = config("SITE_ID", default=1, cast=int)

# ? --- BASIC EMAIL SERVICE DATA
# ? ----------------------------
SENDER_EMAIL = config("SENDER_EMAIL")
SENDER_EMAIL_PASSWORD = config("SENDER_EMAIL_PASSWORD")

RECIPIENT_EMAIL = config("RECIPIENT_EMAIL")

# ? --- MAILJET HTTP SERVER SETTINGS
# ? --------------------------------
USE_MAILJET_HTTP_SERVER = config("USE_MAILJET_HTTP_SERVER", default=False, cast=bool)

MAILJET_APIKEY_PUBLIC = config("MAILJET_APIKEY_PUBLIC")
MAILJET_APIKEY_PRIVATE = config("MAILJET_APIKEY_PRIVATE")

# ? --- DJANGO SMTP SERVER SETTINGS
# ? -------------------------------
USE_DJANGO_SMTP_SERVER = config("USE_DJANGO_SMTP_SERVER", default=True, cast=bool)

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

EMAIL_HOST = config("EMAIL_HOST", default="smtp.gmail.com")
EMAIL_PORT = config("EMAIL_PORT", default=587, cast=int)
EMAIL_USE_SSL = config("EMAIL_USE_SSL", default=False, cast=bool)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=True, cast=bool)

EMAIL_HOST_USER = SENDER_EMAIL
EMAIL_HOST_PASSWORD = SENDER_EMAIL_PASSWORD

DEFAULT_FROM_EMAIL = SENDER_EMAIL

# ? --- Database settings for development mode
# ? ------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": config("SQL_ENGINE", default="django.db.backends.sqlite3"),
        "NAME": config("SQL_DATABASE", default=str(BASE_DIR / "db.sqlite3")),
        "USER": config("SQL_USER", default="dummy_guy"),
        "PASSWORD": config("SQL_PASSWORD", default="dummy_guy_password"),
        "HOST": config("SQL_HOST", default="localhost"),
        "PORT": config("SQL_PORT", default=5432, cast=int),
    }
}

# ? --- DATABASE FIELDS ENCRYPTION --- DISABLED IN DEV MODE
# ? -------------------------------------------------------
FIELD_ENCRYPTION_KEY = config(
    "FIELD_ENCRYPTION_KEY", default=base64.urlsafe_b64encode(b"0" * 32).decode()
).encode()

# ? --- CSRF
# ? --------
CSRF_TRUSTED_ORIGINS = config(
    "CSRF_TRUSTED_ORIGINS", default="http://127.0.0.1:8000,http://localhost:8000"
).split(",")

# ? --- COMPRESSOR
# ? --------------
COMPRESS_OFFLINE = config("COMPRESS_OFFLINE", default=False, cast=bool)

# ? --- ONLY FOR MEDIA FILES
# ? ------------------------
# CSRF_TRUSTED_ORIGINS = ["http://localhost:1337"]
