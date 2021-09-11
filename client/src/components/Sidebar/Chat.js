import { useState, useEffect, React } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import { markReadConversation } from "../../store/utils/thunkCreators";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;

  const handleClick = async (conversation) => {
    if (conversation.id) {
      let lastReadMessageId = null;

      for (let i = conversation.messages.length - 1; i >= 0; i--) {
        const message = conversation.messages[i];

        if (message.senderId === conversation.otherUser.id) {
          lastReadMessageId = message.id;
          break;
        }
      }
      props.markReadConversation(conversation.id, lastReadMessageId);
    }

    await props.setActiveChat(conversation.otherUser.username);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    markReadConversation: (id, lastReadMessageId) => {
      dispatch(markReadConversation(id, lastReadMessageId));
    },
  };
};

export default connect(null, mapDispatchToProps)(Chat);
