from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class Room(models.Model):
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private')
    ]

    name = models.CharField(max_length=25)
    visibility = models.CharField(max_length=15, choices=VISIBILITY_CHOICES) # Text base, think of better options later on
    members = models.ManyToManyField(User)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rooms")


    def __str__(self):
        return f"Room: {self.name}"



class Spot(models.Model):
    title = models.CharField(max_length=50)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="spots")

    def __str__(self):
        return f"Spot in Room: {self.room.name} with Title: {self.title}"


class Message(models.Model):
    MSG_STATUS = [
        ('pending', 'Pending'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
    ]

    content = models.TextField()
    status = models.CharField(max_length=25, choices=MSG_STATUS, default="delivered")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    spot = models.ForeignKey(Spot, on_delete=models.CASCADE, related_name='messages')

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message: {self.content[:20]}..."


