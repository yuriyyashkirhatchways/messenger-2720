from django.db import models

from .user import User


class Conversation(utils.CustomModel):
    users = models.ManyToManyField(User)

    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)

    # find conversation given a list of user Ids
    def find_conversation(userIds):
        try:
            convos = Conversation.objects.all()
            for userId in userIds:
                convos = convos.filter(users=userId)

            if len(convos):
                return convos[0]
            else:
                return None
        except Conversation.DoesNotExist:
            return None
