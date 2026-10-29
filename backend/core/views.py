from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import MessageSerializer, RoomCreateSerializer, RoomDetailSerializer, RoomListSerializer, SpotSerializer
from .models import Message, Room, Spot

class RoomCreateView(CreateAPIView):
    serializer_class = RoomCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        room = serializer.save(owner=self.request.user)
        room.members.add(self.request.user)

        Spot.objects.create(title="General", room=room)

class ExploreRoomsView(ListAPIView):
    serializer_class = RoomListSerializer

    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        # 1. Get the current logged-in user
        user = self.request.user
        
        return Room.objects.filter(visibility='public').exclude(members=user)


    
class YourRoomsView(ListAPIView):
    serializer_class = RoomListSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        return Room.objects.filter(members=self.request.user)

class RoomJoinView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        room = get_object_or_404(Room, pk=pk)


        if room.visibility == "private":
            return Response(
                {"detail": "You don't have access to this room"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        room.members.add(request.user)

        return Response({"success": "User added to room"}, status=status.HTTP_200_OK)


class RoomDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomDetailSerializer
    queryset = Room.objects.all()

    lookup_url_kwarg = 'room_id' 


class SpotCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SpotSerializer


class SpotView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SpotSerializer
    queryset = Spot.objects.all()
    lookup_field = "title"

    def get_object(self):
        room_id = self.kwargs["room_id"]
        spot_title = self.kwargs["title"]

        obj = get_object_or_404(Spot, room_id=room_id, title=spot_title)
        
        self.check_object_permissions(self.request, obj)
        return obj


class SpotMessageListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        spot_id = self.kwargs['spot_id']

        return Message.objects.filter(spot_id=spot_id).order_by('timestamp')