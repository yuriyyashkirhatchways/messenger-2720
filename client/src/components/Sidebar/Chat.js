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

  const [unreadCount, setUnreadCount] = useState(0);

  const handleClick = async (conversation) => {
    if (conversation.id) {
      props.markReadConversation(conversation.id);
    }

    await props.setActiveChat(conversation.otherUser.username);
  };

  useEffect(() => {
    if (!conversation.userReadAt) {
      setUnreadCount(conversation.messages.length);
    } else {
      let count = 0;

      // TODO this should scan in reverse for efficiency
      for (const message of conversation.messages) {
        if (message.senderId === conversation.otherUser.id &&
            new Date(conversation.userReadAt) < new Date(message.createdAt))
        {
          count += 1;
        }
      }
      
      setUnreadCount(count);
    }
  }, [conversation]);

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} unreadCount={unreadCount} />
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    markReadConversation: (id) => {
      dispatch(markReadConversation(id));
    },
  };
};

export default connect(null, mapDispatchToProps)(Chat);
