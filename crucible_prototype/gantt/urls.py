from django.urls import path
from .views import TimelineView, load_initial_data, sync_data

urlpatterns = [
    path('timeline/', TimelineView.as_view(), name='timeline'),
    path('api/load/', load_initial_data, name='load_initial_data'),
    path('api/sync/', sync_data, name='sync_data'),
]
