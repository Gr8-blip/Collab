from django.urls import re_path
from . import consumers


websocket_urlpatterns = [
   re_path(r'^ws/chat/spot/(?P<spot_id>\d+)/$', consumers.SpotConsumer.as_asgi())
]