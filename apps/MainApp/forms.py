from django import forms


class FeedbackForm(forms.Form):
    client_name = forms.CharField(
        max_length=35,
        label="Имя",
        widget=forms.TextInput(
            attrs={
                "id": "client_name",
                "placeholder": "Имя",
                "maxlength": "35",
                "autocomplete": "name",
                "pattern": "^[A-Za-zА-Яа-я]+$",  # Регулярное выражение для имени
                "title": "Введите только буквы, от 1 до 35 символов",
            }
        ),
        error_messages={
            "required": "Пожалуйста, введите ваше имя.",
            "max_length": "Имя не должно превышать 35 символов.",
            "invalid": "Введите только буквы.",
        },
    )

    client_phone = forms.CharField(
        max_length=18,
        label="Телефон",
        widget=forms.TextInput(
            attrs={
                "id": "client_phone",
                "placeholder": "Телефон",
                "maxlength": "18",
                "autocomplete": "tel",
                "pattern": r"\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}",
                "title": "Введите телефон в формате +7 (123) 456-78-90",
            }
        ),
        error_messages={
            "required": "Пожалуйста, введите ваш телефон.",
            "max_length": "Телефон не должен превышать 18 символов.",
            "invalid": "Введите телефон в формате +7 (123) 456-78-90.",
        },
    )

    privacy_policy = forms.BooleanField(
        label="",
        required=True,
        widget=forms.CheckboxInput(
            attrs={
                "id": "privacy-policy",
                "aria-label": "Кнопка подтверждения согласия с политикой конфиденциальности",
                "title": "Подтвердите, что согласны с Политикой конфиденциальности нашего сайта.",
            }
        ),
        error_messages={
            "required": "Пожалуйста, подтвердите согласие с политикой конфиденциальности."
        },
    )
