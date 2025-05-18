from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from .views import AssignmentViewSet
from .views import ClassroomsViewSet

routerUsers = DefaultRouter()
routerUsers.register(r'users', UserViewSet, basename='user')

routerAssignments = DefaultRouter()
routerAssignments.register(r'', AssignmentViewSet, basename='user')

routerClassrooms = DefaultRouter()
routerClassrooms.register(r'', ClassroomsViewSet, basename='classrooms')

urlpatterns = [
    path('assignment/', include(routerAssignments.urls)),
    path('auth/', include(routerUsers.urls)),
    path('classrooms/', include(routerClassrooms.urls)),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', jwt_views.TokenVerifyView.as_view(), name='token_verify'),
]
