document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('my-feedback-form');
    var submitButton = document.getElementById('my-feedback-form-submit-button');
    var originalText = submitButton.value;
    var dots = 0;
    var interval;

    form.addEventListener('submit', function(event) {
        // Предотвращаем повторную отправку
        if (submitButton.disabled) {
            event.preventDefault(); // Предотвращаем отправку формы, если кнопка уже заблокирована
            return;
        }

        submitButton.disabled = true;

        // Запускаем анимацию текста
        interval = setInterval(function() {
            dots = (dots + 1) % 4; // Используем модульное деление для создания эффекта "Отправка.", "Отправка..", "Отправка..."
            submitButton.value = originalText + '.'.repeat(dots);
        }, 300); // Обновление каждые 300 мс

        // Здесь можно добавить асинхронный запрос, если требуется
        // Например, можно использовать fetch для отправки данных формы через AJAX

        // Остановить анимацию и изменить текст после отправки формы
        // Если вы используете AJAX для отправки формы, обработайте результат в этом месте
        // Например:
        // fetch(form.action, {
        //     method: 'POST',
        //     body: new FormData(form)
        // }).then(response => {
        //     clearInterval(interval);
        //     submitButton.value = 'Отправлено';
        // }).catch(error => {
        //     clearInterval(interval);
        //     submitButton.value = 'Ошибка';
        // });

        // Если форма отправляется обычным способом, измените текст после завершения отправки
        setTimeout(function() {
            clearInterval(interval);
            submitButton.value = 'Отправлено'; // Можно изменить на что-то другое, если нужно
        }, 1000); // Задержка до завершения отправки формы
    });
});