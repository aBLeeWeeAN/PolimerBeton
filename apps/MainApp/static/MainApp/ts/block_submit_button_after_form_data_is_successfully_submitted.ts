document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("my-feedback-form") as HTMLFormElement | null;
    const submitButton = document.getElementById("my-feedback-form-submit-button") as HTMLInputElement | null;

    if (!submitButton) {
        throw new Error("Error --- block_submit_button_after_form_data_is_successfully_submitted.ts --- Submit button not found!");
    }

    if (!form) {
        throw new Error("Error --- block_submit_button_after_form_data_is_successfully_submitted.ts --- Form not found!");
    }

    var originalText = submitButton.value;
    var dots = 0;

    var interval: NodeJS.Timeout;
    form.addEventListener("submit", function (event) {
        // Предотвращаем повторную отправку
        if (submitButton.disabled) {
            event.preventDefault(); // Предотвращаем отправку формы, если кнопка уже заблокирована
            return;
        }

        submitButton.disabled = true;

        // Запускаем анимацию текста
        interval = setInterval(function () {
            dots = (dots + 1) % 4; // Используем модульное деление для создания эффекта "Отправка.", "Отправка..", "Отправка..."
            submitButton.value = originalText + ".".repeat(dots);
        }, 300); // Обновление каждые 300 мс

        // Если форма отправляется обычным способом, измените текст после завершения отправки
        setTimeout(function () {
            clearInterval(interval);
            submitButton.value = "Отправлено"; // Можно изменить на что-то другое, если нужно
        }, 1000); // Задержка до завершения отправки формы
    });
});

export {};
