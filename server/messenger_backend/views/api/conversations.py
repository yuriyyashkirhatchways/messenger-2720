from django.contrib.auth.middleware import get_user
from django.db.models import Max, Q
from django.db.models.query import Prefetch
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Conversation, Message
from online_users import online_users
from rest_framework.views import APIView
from rest_framework.request import Request


class Conversations(APIView):
    """get all conversations for a user, include latest message text for preview, and all messages
    include other user model so we have info on username/profile pic (don't include current user info)
    TODO: for scalability, implement lazy loading"""

    def get(self, request: Request):
        try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)
            user_id = user.id

            conversations = (
                Conversation.objects.filter(Q(user1=user_id) | Q(user2=user_id))
                .prefetch_related(
                    Prefetch(
                        "messages", queryset=Message.objects.order_by("-createdAt")
                    )
                )
                .all()
            )

            conversations_response = []

            for convo in conversations:
                # calculate unread for each user:w
                user1ReadStatus = {"unread": 0, "lastReadMessageId": None}
                user2ReadStatus = {"unread": 0, "lastReadMessageId": None}

                # we check each message to see if it is unread and count it.
                # If no unread messages remain set lastReadMessageId; we are done.
                for message in convo.messages.all():
                    if convo.user1ReadAt and message.senderId != convo.user1.id and not user1ReadStatus["lastReadMessageId"]:
                        if message.createdAt > convo.user1ReadAt:
                            user1ReadStatus["unread"] += 1
                        else:
                            user1ReadStatus["lastReadMessageId"] = message.id
                    elif convo.user2ReadAt and message.senderId != convo.user2.id and not user2ReadStatus["lastReadMessageId"]:
                        if message.createdAt > convo.user2ReadAt:
                            user2ReadStatus["unread"] += 1
                        else:
                            user2ReadStatus["lastReadMessageId"] = message.id
                    else:
                        break
                print(user1ReadStatus, user1ReadStatus)

                convo_dict = {
                    "id": convo.id,
                    "messages": [
                        message.to_dict(["id", "text", "senderId", "createdAt"])
                        for message in convo.messages.all()
                    ],
                }

                # set properties for notification count and latest message preview
                convo_dict["latestMessageText"] = convo_dict["messages"][0]["text"]

                # set a property "otherUser" so that frontend will have easier access
                user_fields = ["id", "username", "photoUrl"]
                if convo.user1 and convo.user1.id != user_id:
                    convo_dict["otherUser"] = convo.user1.to_dict(user_fields)
                elif convo.user2 and convo.user2.id != user_id:
                    convo_dict["otherUser"] = convo.user2.to_dict(user_fields)

                # set property for online status of the other user
                if convo_dict["otherUser"]["id"] in online_users:
                    convo_dict["otherUser"]["online"] = True
                else:
                    convo_dict["otherUser"]["online"] = False

                # set properties "userReadAt", "otherUserReadAt", "unread", and "otherUserLastReadMessageId"
                if convo.user1 and convo.user1.id != user_id:
                    convo_dict["userReadAt"] = convo.user2ReadAt
                    convo_dict["otherUserReadAt"] = convo.user1ReadAt
                    convo_dict["unread"] = user2ReadStatus["unread"]
                    convo_dict["otherUserLastReadMessageId"] = user1ReadStatus["lastReadMessageId"]
                elif convo.user2 and convo.user2.id != user_id:
                    convo_dict["userReadAt"] = convo.user1ReadAt
                    convo_dict["otherUserReadAt"] = convo.user2ReadAt
                    convo_dict["unread"] = user1ReadStatus["unread"]
                    convo_dict["otherUserLastReadMessageId"] = user2ReadStatus["lastReadMessageId"]

                conversations_response.append(convo_dict)
            conversations_response.sort(
                key=lambda convo: convo["messages"][0]["createdAt"],
                reverse=True,
            )
            return JsonResponse(
                conversations_response,
                safe=False,
            )
        except Exception as e:
            return HttpResponse(status=500)
