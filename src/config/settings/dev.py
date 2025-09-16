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

# ? --- EMAIL SETTINGS
# ? ------------------
# EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="email_address_for_dummy_guys")
# EMAIL_HOST_PASSWORD = config(
#     "EMAIL_HOST_PASSWORD", default="email_password_for_dummy_guys"
# )
# DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

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
