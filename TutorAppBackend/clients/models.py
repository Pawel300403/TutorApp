from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Client(models.Model):
    name = models.CharField(max_length=255)
    info = models.JSONField(default=dict, blank=True)
    
class ClientMember(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='client_links')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='member')
    
    class Meta:
        unique_together = ('user', 'client')
        
        
class ClientActivities(models.Model):
    name = models.CharField(max_length=255)
    kind = models.CharField(max_length=255)
    base_duration = models.IntegerField(default=0)
    base_rate = models.FloatField(default=0)
    
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='activities')