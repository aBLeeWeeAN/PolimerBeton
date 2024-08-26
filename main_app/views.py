from django.shortcuts import render, redirect
from .forms import FeedbackForm  # Импортируйте форму, которую вы создали

# Create your views here.
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

def privacy(request):
    return render(request, 'main_app/privacy.html')

def success(request):
    return render(request, 'main_app/success.html')