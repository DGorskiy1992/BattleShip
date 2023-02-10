from django.shortcuts import render
from django.http import Http404
from django.contrib import auth
from django.shortcuts import redirect
from MainApp.models import User, Player
from MainApp.forms import UserRegistrationForm
from django.contrib.auth.decorators import login_required


def index_page(request):
    if request.user.is_anonymous:
        return render(request, 'index.html')
    else:
        player = Player.objects.get(user=request.user)
        return render(request, 'index.html', {'player_rang': player.rang})


def game_page(request):
    return render(request, 'game.html')


def player_info(request, name):
    player = Player.objects.get(user__username=name)
    return render(request, 'player_info.html', {'player': player})

def game_won(request):
    if request.method == "POST":
        if request.user.is_anonymous:
            return render(request, 'game_is_won.html')
        if request.POST.get("is_won"):
            is_won = request.POST.get("is_won")
            if is_won == "true":
                player = Player.objects.get(user=request.user)
                player.rang = player.rang + 1
                player.games_played = player.games_played + 1
                player.games_won = player.games_won + 1
                player.save()
                return render(request, 'game_is_won.html')
    raise Http404



def players_rate(request):
    players = Player.objects.all().order_by('rang')
    return render(request, 'players_rating.html', {'players': players})


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
            new_user = form.save()
            new_player = Player.objects.create(user=new_user, rang=1, games_played=0, games_won=0)
            return redirect('index')
        context = {'pagename': 'Регитрация пользователя', 'form': form}
        return render(request, 'registration.html', context)

# def create_player(request):
#     if request.method == 'POST':
#         form = PlayerForm(request.POST)
#         if form.is_valid():
#             player = form.save(commit=False)
#             player.user = request.user
#             player.rang = 1
#             player.games_played = 0
#             player.games_won = 0
#             player.save()
#     raise Http404
