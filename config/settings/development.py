from .base import *

# ? --- SECRET KEY SETTINGS
# ? -----------------------
SECRET_KEY = config("DJANGO_SECRET_KEY", default="secret_key_for_dummy_guys")

# ? --- Debug settings
# ? ------------------
DEBUG = config("DJANGO_DEBUG", default=True, cast=bool)

# ? --- Allowed hosts
# ? -----------------
ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS", default="127.0.0.1,localhost").split(",")

# ? --- Need for sitemap.xml
# ? ------------------------
SITE_ID = config("SITE_ID", default=1, cast=int)

# ? --- EMAIL SETTINGS
# ? ------------------
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="email_address_for_dummy_guys")
EMAIL_HOST_PASSWORD = config(
    "EMAIL_HOST_PASSWORD", default="email_password_for_dummy_guys"
)
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# ? --- SQLite database for development mode
# ? ----------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ? --- DATABASE FIELDS ENCRYPTION
# ? ------------------------------
FIELD_ENCRYPTION_KEY = config(
    "FIELD_ENCRYPTION_KEY", default="field_encryption_key_for_dummy_guys"
).encode()

# ? --- COMPRESSOR
# ? --------------
COMPRESS_OFFLINE = config("COMPRESS_OFFLINE", default=False, cast=bool)
