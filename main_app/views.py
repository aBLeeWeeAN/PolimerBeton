from django.shortcuts import render, redirect
from .forms import FeedbackForm  # Импортируйте форму, которую вы создали

# from htmlmin.decorators import minified_response

# Create your views here.
# @minified_response
def index(request):
    if request.method == 'POST':
        form = FeedbackForm(request.POST)
        if form.is_valid():
            # Здесь можно обработать данные формы
            # Например, сохранить их в базу данных или отправить на email

            # Перенаправление на страницу успешной отправки
            return redirect('success')
    else:
        form = FeedbackForm()

    return render(request, 'main_app/index.html', {'form': form})

# @minified_response
def privacy(request):
    return render(request, 'main_app/privacy.html')

# @minified_response
def success(request):
    return render(request, 'main_app/success.html')