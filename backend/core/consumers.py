from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, Spot

@database_sync_to_async
def get_spot_from_db(spot_id):
    try:
        return Spot.objects.select_related("room").get(id=spot_id)
    
    except Spot.DoesNotExist:
        return None

@database_sync_to_async
def save_message_to_db(message_text, spot, user):

    return Message.objects.create(
        user=user,
        spot=spot,
        content=message_text,
        status="delivered",
    )

class SpotConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.spot_id = self.scope['url_route']['kwargs']['spot_id']
        self.spot = await get_spot_from_db(self.spot_id)

        if self.spot is None:
            await self.close(code=4404)
            return

        if self.scope['user'].is_anonymous:
            await self.close(code=4401)
            return
        
        self.room_group_name = f"chat_{self.spot_id}"
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def receive_json(self, content, **kwargs):
        message_text = content.get("message")
        user = self.scope['user']

        if not message_text:
            return
        
        await save_message_to_db(
            user=user,
            spot=self.spot,
            message_text=message_text,
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'spot_message_broadcast',
                'message': message_text,
                'sender': user.email
            }
        )
    
    async def spot_message_broadcast(self, event):
        await self.send_json(
            {
                'message': event['message'],
                'sender': event['sender']
            }
        )
    
    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )