from rest_framework import serializers
from .models import Client, ClientMember, ClientActivities

class ClientSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Client
        fields = '__all__'
        
    def create(self, validated_data):
        user = self.context["request"].user
        client = Client.objects.create(**validated_data)
        ClientMember.objects.create(client=client, user=user)
        return client
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.info = validated_data.get('info', instance.info)
        instance.save()
        return instance 

class ActivitySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ClientActivities
        exclude = ['client']
        
    def create(self, validated_data):
        client = Client.objects.get(pk=self.context["client_id"])
        activity = ClientActivities.objects.create(client=client, **validated_data)
        return activity
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.kind = validated_data.get('kind', instance.kind)
        instance.base_duration = validated_data.get('base_duration', instance.base_duration)
        instance.base_rate = validated_data.get('base_rate', instance.base_rate)
        instance.save() 
        return instance
        
        
class ClientActivitySerializer(serializers.ModelSerializer):
    
    activities = ActivitySerializer(many=True)
    
    class Meta:
        model = Client
        fields = ['id', 'name', 'info', 'activities']