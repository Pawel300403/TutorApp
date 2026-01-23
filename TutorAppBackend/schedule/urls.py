from django.urls import path
from .views import ScheduleView, DailyScheduleView, WeekScheduleView, MonthScheduleView, AllMonthSalaryView, MonthSalaryView


urlpatterns = [
    path("schedule/", ScheduleView.as_view(), name='schedule'),
    path("schedule/<int:activity_id>/", ScheduleView.as_view(), name='newscheduleactivity'),
    path("schedule/edit/<int:schedule_id>/", ScheduleView.as_view(), name='editschedule'),
    path("schedule/delete/<int:schedule_id>/", ScheduleView.as_view(), name='deleteschedule'),
    path("schedule/today/", DailyScheduleView.as_view(), name='dailyschedule'),
    path("schedule/week/", WeekScheduleView.as_view(), name='weekschedule'),
    path("schedule/month/", MonthScheduleView.as_view(), name='monthschedule'),
    path("schedule/allMonthSalry/", AllMonthSalaryView.as_view(), name='allmonthsalary'),
    path("schedule/monthSalry/", MonthSalaryView.as_view(), name='monthsalary')
]