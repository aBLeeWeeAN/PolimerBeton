from .base import *
from decouple import config

# ? --- SECRET KEY SETTINGS
# ? -----------------------
SECRET_KEY = config("DJANGO_SECRET_KEY")

# ? --- Debug settings
# ? ------------------
DEBUG = config("DJANGO_DEBUG", cast=bool)

# ? --- Allowed hosts
# ? -----------------
ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS").split(",")

# ? --- Need for sitemap.xml
# ? ------------------------
SITE_ID = config("SITE_ID", cast=int)

# ? --- BASIC EMAIL SERVICE DATA
# ? ----------------------------
SENDER_EMAIL = config("SENDER_EMAIL")
SENDER_EMAIL_PASSWORD = config("SENDER_EMAIL_PASSWORD")

RECIPIENT_EMAIL = config("RECIPIENT_EMAIL")

# ? --- MAILJET HTTP SERVER SETTINGS
# ? --------------------------------
USE_MAILJET_HTTP_SERVER = config("USE_MAILJET_HTTP_SERVER", cast=bool)

MAILJET_APIKEY_PUBLIC = config("MAILJET_APIKEY_PUBLIC")
MAILJET_APIKEY_PRIVATE = config("MAILJET_APIKEY_PRIVATE")

# ? --- DJANGO SMTP SERVER SETTINGS
# ? -------------------------------
USE_DJANGO_SMTP_SERVER = config("USE_DJANGO_SMTP_SERVER", cast=bool)

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

EMAIL_HOST = config("EMAIL_HOST")
EMAIL_PORT = config("EMAIL_PORT", cast=int)
EMAIL_USE_SSL = config("EMAIL_USE_SSL", cast=bool)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", cast=bool)

EMAIL_HOST_USER = SENDER_EMAIL
EMAIL_HOST_PASSWORD = SENDER_EMAIL_PASSWORD

DEFAULT_FROM_EMAIL = SENDER_EMAIL

# ? --- Database settings for production mode
# ? -----------------------------------------
DATABASES = {
    "default": {
        "ENGINE": config("SQL_ENGINE"),
        "NAME": config("SQL_DATABASE"),
        "USER": config("SQL_USER"),
        "PASSWORD": config("SQL_PASSWORD"),
        "HOST": config("SQL_HOST"),
        "PORT": config("SQL_PORT", cast=int),
    }
}

# ? --- DATABASE FIELDS ENCRYPTION
# ? ------------------------------
FIELD_ENCRYPTION_KEY = config("FIELD_ENCRYPTION_KEY").encode()

# ? --- CSRF
# ? --------
CSRF_TRUSTED_ORIGINS = config("CSRF_TRUSTED_ORIGINS").split(",")

# ? --- SECURITY SETTINGS (SSL/HTTPS)
# ? ---------------------------------
# SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True

# SECURE_HSTS_SECONDS = 31536000  # ? --- 1 YEAR
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SECURE_HSTS_PRELOAD = True

# X_FRAME_OPTIONS = "DENY"

# SECURE_CONTENT_TYPE_NOSNIFF = True
# SECURE_BROWSER_XSS_FILTER = True

# ? --- COMPRESSOR
# ? --------------
COMPRESS_OFFLINE = config("COMPRESS_OFFLINE", cast=bool)

# ? --- SASS/SCSS
# ? -------------
LIBSASS_OUTPUT_STYLE = "compressed"

# ? --- STATIC FILES
# ? ----------------
STATICFILES_STORAGE = "django.contrib.staticfiles.storage.ManifestStaticFilesStorage"

# ? --- НАСТРОЙКИ HTMLMIN
# ? ---------------------
HTML_MINIFY = True

HTMLMIN = {
    "remove_comments": True,
    "remove_empty_space": True,
    "remove_optional_attribute_quotes": False,
    "remove_empty_tags": True,
    "collapse_whitespace": True,
    "minify_js": True,
    "minify_css": True,
    "ignore": [".no-minify"],
    "preprocessors": [],
}
