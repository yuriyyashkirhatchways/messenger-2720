import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId, otherUserReadAt } = props;

  // Find the last read message by backwards search
  let idOfLastRead = null;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].senderId === userId &&
        new Date(otherUserReadAt) >= new Date(messages[i].createdAt)) 
    {
      idOfLastRead = messages[i].id;
    }
  }

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} id={message.id} text={message.text} time={time} otherUser={otherUser} idOfLastRead={idOfLastRead} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
