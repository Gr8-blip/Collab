from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .views import EmailTokenObtainPairView, RegisterView, MeView

urlpatterns = [
    path('api/token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/me/', MeView.as_view(), name='me'),
]