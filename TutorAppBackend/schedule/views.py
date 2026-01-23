from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Schedule
from .serializers import ScheduleSerializer, ScheduleShowSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .services import is_my_schedule, all_month_salary, month_salary
import datetime
from clients.models import ClientActivities
import json

# Create your views here.
class ScheduleView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        schedule = Schedule.objects.filter(user=user)
        s = ScheduleShowSerializer(schedule, many=True)
        return Response(s.data, status=status.HTTP_200_OK)
    
    def post(self, request, activity_id):
        user = request.user
        activity = get_object_or_404(ClientActivities, pk=activity_id)
        s = ScheduleSerializer(data=request.data, context={'user': user, 'activity': activity}, many=True)
        if s.is_valid():
            s.save()
            return Response(s.data, status.HTTP_201_CREATED)
        return Response(s.errors, status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, schedule_id):
        schedule = get_object_or_404(Schedule, pk=schedule_id)
        s = ScheduleSerializer(schedule, data=request.data, partial=True)
        if s.is_valid():
            s.save()
            return Response(s.data, status.HTTP_200_OK)
        return Response(s.errors, status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, schedule_id):
        user = request.user
        if is_my_schedule(user, schedule_id):
            schedule = get_object_or_404(Schedule, pk=schedule_id)
            schedule.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
class DailyScheduleView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        schedule = Schedule.objects.filter(
            user=user,
            date=datetime.date.today()
        )
        s = ScheduleShowSerializer(schedule, many=True)
        return Response(s.data, status.HTTP_200_OK)
    
class WeekScheduleView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        schedule = Schedule.objects.filter(
            user=user,
            date__same_week=datetime.date.today()
        )
        s = ScheduleShowSerializer(schedule, many=True)
        return Response(s.data, status.HTTP_200_OK)
    
class MonthScheduleView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        month = datetime.date.fromisoformat(request.query_params.get("date"))
        schedule = Schedule.objects.filter(
            user=user,
            date__same_month=month
        )
        s = ScheduleShowSerializer(schedule, many=True)
        return Response(s.data, status.HTTP_200_OK)
    
class AllMonthSalaryView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        total = all_month_salary(user)
        return Response(total, status.HTTP_200_OK)
    
class MonthSalaryView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        total = month_salary(user)
        return Response(total, status.HTTP_200_OK)
    