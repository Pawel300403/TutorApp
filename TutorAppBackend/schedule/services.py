from .models import Schedule
import datetime
from django.db.models import F, Sum, FloatField, ExpressionWrapper

def is_my_schedule(user, schedule_id):
    if Schedule.objects.filter(id=schedule_id, user=user).count():
        return True
    return False

def all_month_salary(user):
    return (
        Schedule.objects
        .filter(
            user=user,
            date__same_month=datetime.date.today()
        )
        .aggregate(
            total=Sum('charge')
        )
    )
    
def month_salary(user):
    return (
        Schedule.objects
        .filter(
            user=user,
            date__same_month=datetime.date.today()
        )
        .aggregate(
            total=Sum('amount_paid')
        )
    )
    
def calculate_charge(schedule: Schedule):
    schedule.charge = schedule.activity.base_rate * schedule.duration / schedule.activity.base_duration