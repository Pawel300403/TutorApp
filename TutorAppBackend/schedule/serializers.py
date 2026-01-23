from rest_framework import serializers
from .models import Schedule
from .services import calculate_charge

class ScheduleSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Schedule
        exclude = ['user', 'activity']
        
    def create(self, validated_data):
        user = self.context["user"]
        activity = self.context["activity"]
        schedule = Schedule.objects.create(user=user, activity=activity, **validated_data)
        calculate_charge(schedule)
        schedule.save()
        return schedule
    
    def update(self, instance, validated_data):
        instance.date = validated_data.get('date', instance.date) 
        instance.time = validated_data.get('time', instance.time)
        instance.duration = validated_data.get('duration', instance.duration)
        instance.status = validated_data.get('status', instance.status)
        instance.p_status = validated_data.get('p_status', instance.p_status)
        instance.amount_paid = validated_data.get('amount_paid', instance.amount_paid)
        calculate_charge(instance)
        instance.save()
        return instance
    
class ScheduleShowSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Schedule
        exclude = ['user']
        depth = 2
        
class ScheduleReportSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Schedule
        exclude = ['user']
        depth = 1