# api/views.py
from django.conf import settings
from django.contrib.auth import authenticate, get_user
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth import get_user_model


# ---------- helper do ciasteczek z refresh -----------

def set_refresh_cookie(response, refresh_token: str):

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=not settings.DEBUG,   
        samesite="Lax",
        path="/api/auth/",   
        max_age=14 * 24 * 3600,     
    )
    return response


def clear_refresh_cookie(response):
    response.delete_cookie(
        key="refresh_token",
        path="/api/auth/",
    )
    return response


# ---------- /api/auth/login/ ----------

@method_decorator(csrf_exempt, name="dispatch")
class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"detail": "Username and password required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        response = Response({"access": access}, status=status.HTTP_200_OK)
        set_refresh_cookie(response, str(refresh))
        return response


# ---------- /api/auth/refresh/ ----------



@method_decorator(csrf_exempt, name="dispatch")
class RefreshView(APIView):
    
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"detail": "No refresh token cookie"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            old_refresh = RefreshToken(refresh_token)
        except TokenError:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = old_refresh.get("user_id")
        if not user_id:
            return Response({"detail": "Invalid refresh token payload"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_401_UNAUTHORIZED)

        # Rotate refresh token
        new_refresh = RefreshToken.for_user(user)
        access = str(new_refresh.access_token)

        response = Response({"access": access}, status=status.HTTP_200_OK)
        set_refresh_cookie(response, str(new_refresh))
        return response


# ---------- /api/auth/logout/ ----------

@method_decorator(csrf_exempt, name="dispatch")
class LogoutView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                pass

        response = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        clear_refresh_cookie(response)
        return response


# ---------- /api/auth/me/ ----------

class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            status=status.HTTP_200_OK,
        )
