<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

![GitHub Last Commit][last-commit-shield]
![GitHub Repo Size][repo-size-shield]

</div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1 align="center">PolimerBeton</h1>

  <p align="center">
    📬 Многостраничный адаптивный рекламный сайт с формой обратной связи и базой данных клиентов.
    <br />
    <br />
    <!-- <a href="ZAPOLNIT">Дизайн (макет)</a>
    &middot; -->
    <a href="https://polimerbeton-vrn.ru/"">Демо</a>
    &middot;
    <a href="https://github.com/aLeeTheY/PolimerBeton/issues/new?labels=bug&template=bug-report---.md">Сообщить об ошибке</a>
  </p>

[![Русский](https://img.shields.io/badge/Русский-blue)](README.md)
[![English](https://img.shields.io/badge/English-blue)](README.ENG.md)

</div>

<!-- TABLE OF CONTENTS -->
<br />
<details>
  <summary>Содержание</summary>
  <ol>
    <li>
      <a href="#о-проекте">О проекте</a>
      <ul>
        <li><a href="#предпросмотр">Предпросмотр</a></li>
        <li><a href="#ключевые-особенности">Ключевые особенности</a></li>
        <li><a href="#используемые-технологии">Используемые технологии</a></li>
        <li><a href="#структура-проекта">Структура проекта</a></li>
        <li><a href="#поддерживаемые-браузеры">Поддерживаемые браузеры</a></li>
      </ul>
    </li>
    <li>
      <a href="#начало-работы">Начало работы</a>
      <ul>
        <li><a href="#предварительные-требования">Предварительные требования</a></li>
        <li>
          <a href="#сборка-и-развертывание-приложения">Сборка и развертывание приложения</a>
          <ul>
            <li><a href="#создание-суперпользователя">Создание суперпользователя</a></li>
            <li><a href="#устранение-проблем-опционально">Устранение проблем (опционально)</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li>
      <a href="#использование">Использование</a>
      <ul>
        <li><a href="#панель-администратора">Панель администратора</a></li>
      </ul>
    </li>
    <li><a href="#сложности-при-разработке">Сложности при разработке</a></li>
    <li><a href="#полученные-навыки">Полученные навыки</a></li>
    <li><a href="#дорожная-карта">Дорожная карта</a></li>
    <li><a href="#лицензия">Лицензия</a></li>
    <li><a href="#контакты">Контакты</a></li>
    <li><a href="#благодарности">Благодарности</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## О проекте

Основная цель проекта — создание быстрого рекламного лендинга с формой обратной связи. Сайт позволяет клиентам оставлять заявки, а владельцу — мгновенно получать уведомления о новых заказах.

### Предпросмотр

Ниже представлен **предварительный просмотр** сайта (_**Desktop + Mobile**, нажмите на изображение для перехода к демо_):

<div align="center">

[![Предпросмотр сайта][website-preview]](https://polimerbeton-vrn.ru/)

</div>

### Ключевые особенности

**Дизайн и интерфейс**

- **Эксклюзивность**: Полностью авторский дизайн страниц сделанный в **Figma**.
- **Адаптивность**: Интерфейс построен на базе **Bootstrap** и **Bootstrap Icons** с полной поддержкой мобильных устройств.
- **Dark Mode**: Поддержка темной темы (автоматическое переключение + ручной режим).
- **UX/UI**: Плавные анимации для улучшения визуального восприятия.

**Безопасность и данные**

- **Шифрование**: Защита данных клиентов на уровне полей базы данных (field-level encryption).
- **Защита окружения**: Строгое разделение конфигураций через файлы `.env`.

**Развертывание и инфраструктура**

- **Контейнеризация**: Полная изоляция через **Docker**, позволяющая развернуть проект в течение 15 минут.
- **CI/CD Workflow**: Автоматизация обновления проекта через **GitHub Actions** и **SSH**.

**Производительность и масштабируемость**

- **Оптимизация статики**: Использование формата `.webp` и адаптивная подгрузка изображений в зависимости от разрешения экрана.
- **Backend**: Связка **Django + Nginx** для стабильной и быстрой работы сервера.
- **Бизнес-логика**: Автоматическая отправка уведомлений о заказах через **SMTP** (опционально — [**Mailjet**][Mailjet-url]).

### Используемые технологии

Проект создан с использованием следующих инструментов и технологий:

- **FRONTEND**:
  - [![HTML][HTML-logo]][HTML-url]
  - [![Sass][Sass-logo]][Sass-url]
  - [![TypeScript][TypeScript-logo]][TypeScript-url]
  - [![Bootstrap][Bootstrap-logo]][Bootstrap-url]

  - **BUILD TOOLS**:
    - [![Node.js][NodeJS-logo]][NodeJS-url]
    - [![Npm][Npm-logo]][Npm-url]

- **BACKEND**:
  - [![Python][Python-logo]][Python-url]
  - [![Django][Django-logo]][Django-url]

  - **BUILD TOOLS**:
    - [![Poetry][Poetry-logo]][Poetry-url]

- **DATABASE**:
  - [![Postgres][Postgres-logo]][Postgres-url]

- **VERSION CONTROL SYSTEM**:
  - [![Git][Git-logo]][Git-url]

- **DEPLOYMENT**:
  - [![Docker][Docker-logo]][Docker-url]

- **WEB SERVER**:
  - [![Nginx][Nginx-logo]][Nginx-url]

- **CI/CD**:
  - [![GitHub Actions][GitHubActions-logo]][GitHubActions-url]

<!-- <div align="center">

| Часть проекта  |                                                                                                                                                   Технологии |
| :------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------: |
| FRONTEND       | [![HTML][HTML-logo]][HTML-url] [![Sass][Sass-logo]][Sass-url] [![TypeScript][TypeScript-logo]][TypeScript-url] [![Bootstrap][Bootstrap-logo]][Bootstrap-url] |
| BACKEND        |                                                                                    [![Python][Python-logo]][Python-url] [![Django][Django-logo]][Django-url] |
| DATABASE       |                                                                                                                   [![Postgres][Postgres-logo]][Postgres-url] |
| [VCS][VCS-url] |                                                                                                                                  [![Git][Git-logo]][Git-url] |
| DEPLOYMENT     |                                                                                                                         [![Docker][Docker-logo]][Docker-url] |

</div> -->

### Структура проекта

Основные каталоги и файлы проекта:

```text
PolimerBeton/
│
├── .github/
│   └── workflows/
│       └── update_website_by_ssh.prod.yml      # GitHub CI/CD сценарий: обновление сайта на хостинге при пуше в ветку `main`
│
├── env/                                        # шаблоны файлов .env для разных сценариев (dev, prod, staging)
│   ├── .env.dev.template
│   ├── .env.prod.db.template
│   ├── .env.prod.proxy-companion.template
│   ├── .env.prod.template
│   ├── .env.staging.db.template
│   ├── .env.staging.proxy-companion.template
│   └── .env.staging.template
│
├── project/                                    # прочие проектные файлы
│   ├── database/                               # схема БД
│   ├── design/                                 # макеты дизайна
│   └── preview/                                # превью файлы репозитория
│
├── src/
│   ├── apps/
│   │   └── MainApp/                            # основное приложение Django
│   │       │
│   │       ├── migrations/                     # миграции БД
│   │       │
│   │       ├── static/                         # исходники статических файлов (будут скомпилированы / собраны)
│   │       │   ├── favicons/
│   │       │   ├── images/
│   │       │   ├── scss/
│   │       │   └── ts/
│   │       │
│   │       ├── templates/                      # шаблоны страниц
│   │       │   │
│   │       │   ├── email/
│   │       │   │   └── message_template.html   # шаблон электронного письма
│   │       │   │
│   │       │   ├── MainApp/
│   │       │   │   ├── error.html
│   │       │   │   ├── index.html
│   │       │   │   ├── privacy.html
│   │       │   │   └── success.html
│   │       │   │
│   │       │   └── service/                    # файлы для поисковых систем и ботов
│   │       │       └── robots.txt
│   │       │
│   │       ├── templatetags/                   # пользовательские template‑теги
│   │       │
│   │       ├── __init__.py
│   │       ├── admin.py                        # кастомизация панели администратора
│   │       ├── apps.py
│   │       ├── context_processors.py           # дополнительные контекст‑процессоры для шаблонов
│   │       ├── fields.py                       # пользовательские поля для моделей или форм
│   │       ├── forms.py                        # классы форм
│   │       ├── models.py                       # модели БД
│   │       ├── runners.py                      # разовые скрипты
│   │       ├── sitemaps.py                     # конфигурация sitemap
│   │       ├── tasks.py                        # фоновые задачи
│   │       ├── tests.py                        # модульные тесты
│   │       ├── urls.py                         # маршрутизация URL для приложения
│   │       ├── utils.py                        # вспомогательные функции
│   │       └── views.py                        # обработчики запросов (представления)
│   │
│   ├── config/                                 # файлы конфигурации Django
│   │   │
│   │   ├── settings/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                         # общие настройки Django
│   │   │   ├── dev.py                          # настройки разработки / пре-продакшена
│   │   │   └── prod.py                         # настройки для продакшена
│   │   │
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── locales/                                # файлы интернационализации
│   ├── scripts/                                # точки входа и вспомогательные скрипты
│   │
│   ├── .dockerignore
│   ├── Dockerfile                              # сборка Docker-образа для разработки
│   ├── Dockerfile.prod                         # сборка Docker-образа для продакшена
│   ├── manage.py                               # точка входа для команд Django
│   ├── package-lock.json                       # фиксация версий зависимостей Node.js
│   ├── package.json                            # зависимости и скрипты для фронтенда
│   ├── poetry.lock                             # фиксация версий зависимостей Python
│   ├── pyproject.toml                          # описание проекта и зависимости Python
│   └── tsconfig.json                           # настройки TypeScript
│
├── web/                                        # конфигурационные файлы веб‑сервера
│   │
│   ├── apache/                                 # конфиги Apache (если нужны для совместимости)
│   │   └── .htaccess
│   │
│   ├── nginx/                                  # основная конфигурация nginx
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   │
│   ├── nginx-proxy/                            # nginx‑proxy (автоматический SSL / reverse proxy)
│   │   │
│   │   ├── vhost.d/
│   │   │   └── default
│   │   │
│   │   ├── .dockerignore
│   │   ├── custom.conf
│   │   ├── Dockerfile
│   │   └── Dockerfile.prod
│   │
│   └── templates/                              # шаблоны для docker‑gen (используется nginx‑proxy)
│       └── docker-gen/
│
├── .gitignore
├── docker-compose.prod.selinux.yml
├── docker-compose.prod.yml                     # деплой в режиме продакшена
├── docker-compose.staging.yml                  # деплой в режиме пре-продакшена
├── docker-compose.yml                          # деплой в режиме разработки
├── LICENSE
├── README.ENG.md
└── README.md
```

### Поддерживаемые браузеры

Проект проверен на корректность отображения и стабильность работы скриптов в актуальных версиях следующих браузеров:

- [![Google Chrome][GoogleChrome-logo]][GoogleChrome-url]
- [![Microsoft Edge][MicrosoftEdge-logo]][MicrosoftEdge-url]
- [![Yandex][Yandex-logo]][Yandex-url]
- [![Firefox][Firefox-logo]][Firefox-url]
- [![Opera][Opera-logo]][Opera-url]

<!-- <div align="center">

[![Google Chrome][GoogleChrome-logo]][GoogleChrome-url]
[![Microsoft Edge][MicrosoftEdge-logo]][MicrosoftEdge-url]
[![Yandex][Yandex-logo]][Yandex-url]
[![Firefox][Firefox-logo]][Firefox-url]
[![Opera][Opera-logo]][Opera-url]

</div> -->

> [!IMPORTANT]
> Информация актуальна для версии **[2.0.4](https://github.com/aLeeTheY/PolimerBeton/releases/tag/2.0.4)**. На момент проверки проект корректно отображался в последних стабильных версиях всех [указанных браузеров](#поддерживаемые-браузеры).
>
> **Дата последней проверки: 1 марта 2026**

<p align="right">(<a href="#readme-top">наверх</a>)</p>

<!-- GETTING STARTED -->

## Начало работы

_Следуйте приведённым ниже инструкциям для корректного развёртывания проекта._

### Предварительные требования

Установите [Docker][Docker-url] и плагин [Docker Compose][Docker-Compose-url]. Затем скачайте данный репозиторий в виде ZIP-архива или клонируйте его с помощью [Git][Git-url]:

```sh
git clone https://github.com/aLeeTheY/PolimerBeton
```

Перейдите в каталог проекта. Далее откройте папку `env/` и создайте конфигурационные файлы на основе соответствующих шаблонов `.template`. Поддерживаются три окружения: **development**, **staging** и **production**.

Например, для окружения **production** выполните:

```sh
cp .env.prod.template .env.prod
cp .env.prod.db.template .env.prod.db
cp .env.prod.proxy-companion.template .env.prod.proxy-companion
```

После этого в **каждом** из созданных файлов замените значения всех переменных, содержащих плейсхолдеры вида `<...>`, на собственные.

Например, для файла `.env.prod.db`:

<div align="center">

| Исходное значение                            | Пример заполнения                              |  Обязательность   |
| :------------------------------------------- | :--------------------------------------------- | :---------------: |
| `POSTGRES_USER=<YOUR_DATABASE_USER>`         | `POSTGRES_USER=db_username_for_dummy_guys`     | **_обязательно_** |
| `POSTGRES_PASSWORD=<YOUR_DATABASE_PASSWORD>` | `POSTGRES_PASSWORD=db_password_for_dummy_guys` | **_обязательно_** |
| `POSTGRES_DB=polimerbeton_db_prod`           | `POSTGRES_DB=polimerbeton_db_prod`             |   _опционально_   |

</div>

<!-- Более подробная информация о плейсхолдерах приведена в разделе [Переменные окружения](#переменные-окружения). -->

### Сборка и развертывание приложения

Выберите соответствующий файл конфигурации (`docker-compose.*.yml`) и запустите сборку с последующим запуском контейнеров:

```sh
docker compose -f docker-compose.prod.yml up -d --build
```

#### Создание суперпользователя

После успешного запуска контейнеров создайте **суперпользователя** для административной панели Django:

```sh
docker exec -it polimerbeton-web python manage.py createsuperuser
```

Следуйте инструкциям в консоли. После выполнения этих шагов проект считается успешно развёрнутым.

#### Устранение проблем (опционально)

_При недостатке оперативной памяти или дискового пространства сборка может завершиться с ошибкой. В этом случае рекомендуется **увеличить** доступные ресурсы. Если это невозможно, можно попробовать выполнить сборку поэтапно._

> [!CAUTION]
> Все команды ниже выполняются на ваш страх и риск!<br />
> Если вы не уверены в своих действиях, рекомендуется обратиться к системному администратору.

Очистите старые образы и кэш сборщика:

```sh
docker image prune
docker builder prune
```

Соберите основной контейнер **web**:

```sh
docker compose -f docker-compose.prod.yml build web
```

Снова выполните очистку:

```sh
docker image prune
docker builder prune
```

Соберите оставшиеся контейнеры и запустите приложение:

```sh
docker compose -f docker-compose.prod.yml up -d
```

<p align="right">(<a href="#readme-top">наверх</a>)</p>

<!-- USAGE EXAMPLES -->

## Использование

После завершения этапа [**Начало работы**](#начало-работы) проект будет доступен по вашему доменному имени (или на `localhost`, если используется конфигурация для разработки).

### Панель администратора

Для доступа к административному интерфейсу перейдите на страницу `admin/`:

```
https://your-domain/admin/
```

Для входа используйте учётные данные superuser. Если суперпользователь ещё не создан, выполните [соответствующую команду](#создание-суперпользователя) в работающем контейнере.

<p align="right">(<a href="#readme-top">наверх</a>)</p>

## Сложности при разработке

- **Оркестрация микросервисов**: Проектирование отказоустойчивого взаимодействия между контейнерами Django, PostgreSQL, Nginx и Let's Encrypt в единой изолированной сети Docker.
- **Автоматизация деплоя Django**: CI/CD скрипт в GitHub Actions обновляет ветку `main` и пересобирает контейнер Django без вмешательства в остальные сервисы (_автоматическое выполнение можно включить при необходимости_).
- **SEO и доступность**: Проведение аудита и оптимизация HTML-структуры для достижения 100/100 баллов по метрикам Accessibility и SEO в Google Lighthouse.
- **Гибкая доставка уведомлений**: Основной канал — SMTP; при блокировке SMTP-портов возможна отправка через Mailjet API по HTTPS.

<p align="right">(<a href="#readme-top">наверх</a>)</p>

## Полученные навыки

- **UI/UX дизайн**: Проектирование пользовательских интерфейсов в Figma, подготовка дизайн-макетов к верстке, создание адаптивных графических ассетов.
- **Fullstack разработка**: Проектирование реляционных баз данных в PostgreSQL, разработка серверной логики на Django, создание строго типизированного фронтенда с использованием Sass, Bootstrap и TypeScript.
- **DevOps и инфраструктура**: Контейнеризация приложений через Docker, управление конфигурациями сред (development/staging/production), настройка сетевого взаимодействия контейнеров.
- **Системное администрирование**: Развертывание приложений на Linux-серверах, конфигурирование Nginx или Apache в качестве обратного прокси, внедрение SSL-сертификатов через Let's Encrypt для обеспечения безопасности.
- **Оптимизация производительности**: Минификация HTML, CSS и JS с использованием `django-htmlmin` и `django-compressor`, внедрение современных графических форматов для минимизации времени загрузки и отрисовки страниц (LCP/FCP).
- **CI/CD**: Настройка автоматизированного деплоя через GitHub Actions, управление удалёнными серверами по протоколу SSH.
- **Документация и GitHub**: Оформление документации и README.md файлов с использованием Markdown, ведение версионного контроля через Git.
- **Управление зависимостями и сборка**: Использование [Npm][Npm-url] и [Poetry][Poetry-url] для установки, обновления и фиксации версий библиотек через lock-файлы, обеспечивая воспроизводимость среды разработки.

<p align="right">(<a href="#readme-top">наверх</a>)</p>

<!-- ROADMAP -->

## Дорожная карта

- [x] Проектирование интерфейсов в **Figma**:
  - [x] Главная страница (`index.html`)
  - [x] Политика конфиденциальности (`privacy.html`)
  - [x] Страница успешной отправки (`success.html`)
  - [x] Страница ошибки (`error.html`)
- [x] Адаптивная верстка с использованием **Bootstrap** и поддержкой **тёмной темы**
- [x] Интеграция верстки в шаблоны **Django**
- [x] Проектирование архитектуры БД в **PostgreSQL** (клиенты и заказы)
- [x] Настройка логики взаимодействия `django-admin` с моделями данных
- [x] Реализация подсистемы обработки форм и регистрации клиентов
- [x] Разработка сервиса уведомлений по протоколу **SMTP**
- [x] Разработка альтернативного сервиса уведомлений через **Mailjet** API
- [x] Внедрение механизмов **шифрования и защиты персональных данных**
- [x] Реализация механизма управления пользовательским согласием (**Cookie Consent**)
- [x] Интеграция сторонних метрик (**Google Analytics + Yandex Metrica**) с соблюдением политики Cookie
- [x] Контейнеризация и деплой с использованием **Docker**:
  - [x] Конфигурация сред окружения (`.env.dev`, `.env.staging`, `.env.prod`)
  - [x] Оптимизация образов (**Dockerfile** и **Dockerfile.prod**)
  - [x] Оркестрация микросервисов (**Django**, **PostgreSQL**, **Let's Encrypt**, **Nginx**) через `docker-compose`
- [x] Автоматизация **CI/CD** через **GitHub Actions**:
  - [x] Автоматическая сборка и деплой при обновлении ветки `main`
- [ ] Интернационализация (i18n):
  - [ ] Поддержка английского языка (English)

Полный список планируемых функций и известных проблем доступен в разделе [Issues][issues-url].

<p align="right">(<a href="#readme-top">наверх</a>)</p>

<!-- LICENSE -->

## Лицензия

Copyright © 2025 [aLeeTheY](https://github.com/aLeeTheY)
<br/>
Проект распространяется по лицензии [MIT][license-url]. Смотрите файл `LICENSE` для получения подробной информации.

<p align="right">(<a href="#readme-top">наверх</a>)</p>

<!-- CONTACT -->

## Контакты

GitHub: [aLeeTheY](https://github.com/aLeeTheY)
<br/>
Email: [aleethey@gmail.com](mailto:aleethey@gmail.com)

<p align="right">(<a href="#readme-top">наверх</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Благодарности

[aLeeTheY](https://github.com/aLeeTheY) выражает благодарность разработчикам и сообществам следующих проектов:

- [Figma](https://www.figma.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Django](https://www.djangoproject.com/)
- [Python](https://www.python.org/)
- [Poetry](https://python-poetry.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Sass](https://sass-lang.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [Npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Docker](https://www.docker.com/)
- [Nginx](https://nginx.org/)
- [Git](https://git-scm.com/)
- [GitHub](https://github.com/)
- [GitHub Actions](https://github.com/features/actions)
- [Mailjet](https://www.mailjet.com/)
- [Chocolatey](https://chocolatey.org/)
- [FFmpeg](https://www.ffmpeg.org/)
- [gifsicle](https://github.com/kohler/gifsicle)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)

Без этих инструментов, разработка данного проекта была бы **невозможна**.

<p align="right">(<a href="#readme-top">наверх</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[contributors-url]: https://github.com/aLeeTheY/PolimerBeton/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[forks-url]: https://github.com/aLeeTheY/PolimerBeton/network/members
[stars-shield]: https://img.shields.io/github/stars/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[stars-url]: https://github.com/aLeeTheY/PolimerBeton/stargazers
[issues-shield]: https://img.shields.io/github/issues/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[issues-url]: https://github.com/aLeeTheY/PolimerBeton/issues
[license-shield]: https://img.shields.io/github/license/aLeeTheY/PolimerBeton.svg?style=for-the-badge
[license-url]: https://github.com/aLeeTheY/PolimerBeton/blob/main/LICENSE
[last-commit-shield]: https://img.shields.io/github/last-commit/aLeeTheY/PolimerBeton?style=for-the-badge
[repo-size-shield]: https://img.shields.io/github/repo-size/aLeeTheY/PolimerBeton?style=for-the-badge
[HTML-logo]: https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white&style=for-the-badge
[HTML-url]: https://html.spec.whatwg.org/
[Sass-logo]: https://img.shields.io/badge/Sass-C69?logo=sass&logoColor=fff&style=for-the-badge
[Sass-url]: https://sass-lang.com/
[Bootstrap-logo]: https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=fff&style=for-the-badge
[Bootstrap-url]: https://getbootstrap.com/
[TypeScript-logo]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge
[TypeScript-url]: https://www.typescriptlang.org/
[Python-logo]: https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff&style=for-the-badge
[Python-url]: https://www.python.org/
[Django-logo]: https://img.shields.io/badge/Django-%23092E20.svg?logo=django&logoColor=white&style=for-the-badge
[Django-url]: https://www.djangoproject.com/
[Poetry-logo]: https://custom-icon-badges.demolab.com/badge/Poetry-1F293A?logo=poetry&style=for-the-badge
[Poetry-url]: https://python-poetry.org/
[Docker-logo]: https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff&style=for-the-badge
[Docker-url]: https://www.docker.com/
[Docker-Compose-url]: https://docs.docker.com/compose/
[Postgres-logo]: https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white&style=for-the-badge
[Postgres-url]: https://www.postgresql.org/
[Git-logo]: https://img.shields.io/badge/Git-F05032?logo=git&logoColor=fff&style=for-the-badge
[Git-url]: https://git-scm.com/
[Nginx-logo]: https://img.shields.io/badge/nginx-009639?logo=nginx&logoColor=fff&style=for-the-badge
[Nginx-url]: https://nginx.org/
[GitHubActions-logo]: https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white&style=for-the-badge
[GitHubActions-url]: https://github.com/features/actions
[NodeJS-logo]: https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white&style=for-the-badge
[NodeJS-url]: https://nodejs.org/
[Npm-logo]: https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff&style=for-the-badge
[Npm-url]: https://www.npmjs.com/
[Opera-logo]: https://img.shields.io/badge/Opera-FF1B2D?logo=Opera&logoColor=white&style=for-the-badge
[Opera-url]: https://www.opera.com/
[GoogleChrome-logo]: https://img.shields.io/badge/Google%20Chrome-4285F4?logo=GoogleChrome&logoColor=white&style=for-the-badge
[GoogleChrome-url]: https://www.google.com/chrome/
[MicrosoftEdge-logo]: https://custom-icon-badges.demolab.com/badge/Microsoft%20Edge-2771D8?logo=edge-white&logoColor=white&style=for-the-badge
[MicrosoftEdge-url]: https://www.microsoft.com/en-us/edge/
[Firefox-logo]: https://img.shields.io/badge/Firefox-FF7139?logo=firefoxbrowser&logoColor=white&style=for-the-badge
[Firefox-url]: https://www.firefox.com/

<!-- [Yandex-logo]: https://img.shields.io/badge/Yandex_Browser-D1300D?style=for-the-badge -->

[Yandex-logo]: https://custom-icon-badges.demolab.com/badge/Yandex%20Browser-F03911?logo=yandex-browser&style=for-the-badge
[Yandex-url]: https://browser.yandex.com/

<!-- [VCS-url]: https://en.wikipedia.org/wiki/Version_control -->

[Mailjet-url]: https://www.mailjet.com/
[website-preview]: project/preview/preview.gif
