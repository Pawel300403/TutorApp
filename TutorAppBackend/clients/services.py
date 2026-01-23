from .models import Client, ClientMember, ClientActivities
from django.db import transaction

@transaction.atomic
def create_client(data, user) -> Client:
    client = Client.objects.create(
        name = data.name,
        phone = data.phone,
        rate_per_hour = data.rate_per_hour,
        service_rate = data.service_rate,
        info = data.info
        )
    ClientMember.objects.create(client = client, user = user)
    return client

def get_my_clients(user):
    return (
        Client.objects
        .filter(client_links__user=user)
        .distinct()
        .order_by("name")
    )
    
def is_my_client(user, client_id):
    if ClientMember.objects.filter(user=user, client_id=client_id).count():
        return True
    return False
    
def get_client_activities(client_id):
    return (
        ClientActivities.objects
        .filter(client_id=client_id)
    )
    