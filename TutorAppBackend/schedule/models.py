from django.db import models
from django.contrib.auth.models import User
from clients.models import ClientActivities

# Create your models here.
class Schedule(models.Model):
    date = models.DateField()
    time = models.TimeField()
    duration = models.IntegerField()
    status = models.CharField(max_length=255)
    p_status = models.CharField(max_length=255)
    charge = models.FloatField(default=0)
    amount_paid = models.FloatField(default=0)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity = models.ForeignKey(ClientActivities, on_delete=models.CASCADE, related_name='activity')