# import os
from pathlib import Path

DEFAULT_CHARSET = "utf-8"
FILE_CHARSET = "utf-8"

BASE_DIR = Path(__file__).resolve().parent.parent.parent

DEFAULT_DOMAIN = "polimerbeton-vrn.ru"

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    # ? --- STATIC FILES
    # ? ----------------
    "django.contrib.staticfiles",
    # ? --- ?????
    # ? ---------
    "django.contrib.sites",
    "django.contrib.sitemaps",
    # ? --- SASS & TYPESCRIPT
    # ? ---------------------
    # "sass_processor",
    # "django_sass",
    # "django-vite",
    # ? --- HTML, CSS и JS сжатие
    # ? -------------------------
    "compressor",
    "htmlmin",
    # ? --- MY APPS
    # ? -----------
    "apps.MainApp",
]

# ? --- DJANGO VITE
# ? ---------------
# DJANGO_VITE = {
#     "default": {
#         "dev_mode": DEBUG,
#         "build_folder": "vite_dist",
#         "static_url_prefix": "/static_assets/",
#     }
# }

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
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_DIRS = [
    # ? find only '/static/' folders in apps
]
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
    "compressor.finders.CompressorFinder",
    # "sass_processor.finders.CssFinder",
]

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

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


# ? --- LIBSASS
# ? -----------
LIBSASS_ADDITIONAL_INCLUDE_PATHS = [
    str(BASE_DIR / "node_modules"),
]

# ? --- COMPRESSOR --- PRECOMPILERS SETTINGS --- SASS/SCSS & TypeScipt
# ? ------------------------------------------------------------------
ESBUILD_BIN = BASE_DIR / "node_modules" / ".bin" / "esbuild"

COMPRESS_PRECOMPILERS = (
    ("text/x-scss", "django_libsass.SassCompiler"),
    (
        "text/typescript",
        f"{ESBUILD_BIN} {{infile}} --bundle --outfile={{outfile}} --format=esm",
    ),
)

# ? --- COMPRESSOR
# ? --------------
COMPRESS_ROOT = STATIC_ROOT
COMPRESS_URL = STATIC_URL

COMPRESS_CSS_FILTERS = [
    "compressor.filters.css_default.CssAbsoluteFilter",
    "compressor.filters.cssmin.CSSMinFilter",
]
COMPRESS_JS_FILTERS = [
    "compressor.filters.jsmin.JSMinFilter",
]

COMPRESS_ENABLED = True
