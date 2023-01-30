from django.shortcuts import render
from django.contrib import auth
from django.shortcuts import redirect
from MainApp.models import User, Player
from MainApp.forms import UserRegistrationForm


def index_page(request):
    # user = request.user
    # player = Player.objects.get('user' = user)

    return render(request, 'index.html')


def game_page(request):
    return render(request, 'game.html')


def login(request):
    if request.method == 'POST':
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = auth.authenticate(request, username=username, password=password)
        if user is not None:
            auth.login(request, user)
        else:
            pass
        return redirect('index')


def logout(request):
    auth.logout(request)
    return redirect('index')


def register(request):
    if request.method == "GET":
        form = UserRegistrationForm()
        context = {'pagename': 'Регитрация пользователя', 'form': form}
        return render(request, 'registration.html', context)
    if request.method == "POST":
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("index")
        context = {'pagename': 'Регитрация пользователя', 'form': form}
        return render(request, 'registration.html', context)
