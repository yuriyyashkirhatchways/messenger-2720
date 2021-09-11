from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Conversation
from rest_framework.views import APIView
from rest_framework.request import Request
from django.utils import timezone


class ConversationsRead(APIView):
    """Mark the conversation as read from the current user. Stores the last
    read time."""

    def patch(self, request: Request, pk: int):
        try:
            user = get_user(request)
            body = request.data

            if user.is_anonymous:
                return HttpResponse(status=401)
            user_id = user.id

            conversation = Conversation.objects.get(pk=pk)

            if conversation.user1.id == user_id:
                conversation.user1ReadAt = timezone.now()
                conversation.save(update_fields=['user1ReadAt'])
                return JsonResponse({
                    "userId": user_id,
                    "convoId": conversation.id,
                    "readAt": conversation.user1ReadAt,
                    "lastReadMessageId": body["lastReadMessageId"],
                })
            elif conversation.user2.id == user_id:
                conversation.user2ReadAt = timezone.now()
                conversation.save(update_fields=['user2ReadAt'])
                return JsonResponse({
                    "userId": user_id,
                    "convoId": conversation.id,
                    "readAt": conversation.user2ReadAt,
                    "lastReadMessageId": body["lastReadMessageId"],
                })
            else:
                return HttpResponse(status=403)

        except Exception as e:
            print(e)
            return HttpResponse(status=500)
