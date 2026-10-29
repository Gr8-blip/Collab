from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Room, Spot, Message

class RoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['name', 'visibility']

class RoomListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'visibility', 'owner']


    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['owner'] = UserSerializer(instance.owner).data

        return representation



class SpotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spot
        fields = ['id', 'title', 'room']



class RoomDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'visibility' ,'spots']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['spots'] = SpotSerializer(instance.spots, many=True).data
        
        return representation


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['content', 'timestamp', 'user', 'spot', 'status']
        read_only_fields = ['status', 'timestamp', 'user']


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = instance.user.email if instance.user else None # User serializer doesn't have much currently, can be updated when more fields come in

        return representation