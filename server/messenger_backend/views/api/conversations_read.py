from django.contrib.auth.middleware import get_user
from django.http import HttpResponse
from messenger_backend.models import Conversation
from rest_framework.views import APIView
from rest_framework.request import Request
from django.utils import timezone


class ConversationsRead(APIView):
    """Mark the conversation as read from the current user. Stores the last
    read time."""

    def get(self, request: Request, pk: int):
        try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)
            user_id = user.id

            conversation = Conversation.objects.get(pk=pk)

            if conversation.user1.id == user_id:
                conversation.user1ReadAt = timezone.now()
            elif conversation.user2.id == user_id:
                conversation.user2ReadAt = timezone.now()
            else:
                return HttpResponse(status=403) #TODO is this correct status?

            conversation.save()
            return HttpResponse(status=200)

        except Exception as e:
            return HttpResponse(status=500)
