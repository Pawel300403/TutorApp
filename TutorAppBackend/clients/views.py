from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .services import get_my_clients, get_client_activities, is_my_client
from rest_framework.permissions import IsAuthenticated
from .serializers import ClientSerializer, ActivitySerializer
from rest_framework import status
from .models import Client, ClientActivities

# Create your views here.
 
class ClientView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, client_id):
        user = request.user
        if is_my_client(user, client_id):
            client = get_object_or_404(Client, pk=client_id)
            s = ClientSerializer(client)
            return Response(s.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        s = ClientSerializer(data=request.data, context={'request': request})
        if s.is_valid():
            s.save()
            return Response(s.data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, client_id):
        user = request.user
        if is_my_client(user, client_id):
            client = get_object_or_404(Client, pk=client_id)
            s = ClientSerializer(client, data=request.data)
            if s.is_valid():
                s.save()
                return Response(s.data, status=status.HTTP_200_OK)
            return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, client_id):
        user = request.user
        if is_my_client(user, client_id):
            client = get_object_or_404(Client, pk=client_id)
            client.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)

class ClientsView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        clients = get_my_clients(user)
        s = ClientSerializer(clients, many=True)
        return Response(s.data)
        
class ActivityView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request, client_id):
        user = request.user
        if is_my_client(user, client_id):
            s = ActivitySerializer(data=request.data, context={"client_id": client_id})
            if s.is_valid():
                s.save()
                return Response(s.data, status=status.HTTP_201_CREATED)
            return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def get(self, request, client_id):
        user = request.user
        if is_my_client(user, client_id):
            activity = get_client_activities(client_id)
            s = ActivitySerializer(activity, many=True)
            return Response(s.data)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, client_id, activity_id):
        user = request.user
        if is_my_client(user, client_id):
            activity = get_object_or_404(ClientActivities, pk=activity_id)
            s = ActivitySerializer(activity, data=request.data)
            if s.is_valid():
                s.save()
                return Response(s.data, status=status.HTTP_200_OK)
            return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, client_id, activity_id):
        user = request.user
        if is_my_client(user, client_id):
            activity = get_object_or_404(ClientActivities, pk=activity_id)
            activity.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)