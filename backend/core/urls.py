from django.urls import path
from . import views

urlpatterns = [
    path('rooms/create/', views.RoomCreateView.as_view(), name="create-room"),
    path('rooms/explore/', views.ExploreRoomsView.as_view(), name="list-room"),
    path('rooms/mine/', views.YourRoomsView.as_view(), name='my-rooms'),

    path('rooms/<int:pk>/join/', views.RoomJoinView.as_view(), name="join-room"),
    path('rooms/<int:room_id>/', views.RoomDetailView.as_view(), name="room-detail"),
    path('rooms/spots/create/', views.SpotCreateView.as_view(), name="spot-create"),
    path('rooms/<int:room_id>/<str:title>/', views.SpotView.as_view(), name="spot"),

    path('spots/<int:spot_id>/messages/', views.SpotMessageListView.as_view(), name='spot-messages'),
]