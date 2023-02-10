from django.db import models
from django.contrib.auth.models import User


class Player(models.Model):
    rang = models.IntegerField()
    games_played = models.IntegerField()
    games_won = models.IntegerField()
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, blank=True, null=True, related_name='player')
