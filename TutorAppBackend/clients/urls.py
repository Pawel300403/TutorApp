from django.urls import path
from .views import ClientView, ClientsView, ActivityView

urlpatterns = [
    path("newclient/", ClientView.as_view(), name='newclient'),
    path("clients/", ClientsView.as_view(), name="clients"),
    path("client/<int:client_id>/", ClientView.as_view(), name='client'),
    path("client/<int:client_id>/update/", ClientView.as_view(), name='editclient'),
    path("client/<int:client_id>/newactivity/", ActivityView.as_view(), name="newactivity"),
    path("client/<int:client_id>/activities/", ActivityView.as_view(), name='clientactivities'),
    path("client/<int:client_id>/activity/<int:activity_id>/", ActivityView.as_view(), name='editactivity')
]