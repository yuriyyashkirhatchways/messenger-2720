import { useEffect, useState, React } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  unread: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 7,
    paddingRight: 7,
    borderRadius: 18,
    color: "#FFFFFF",
    backgroundColor: "#2222FF",
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();
  const [unread, setUnread] = useState(null);

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  useEffect(() => {
    if (!conversation.userReadAt) {
      setUnread(conversation.messages.length);
    } else {
      let count = 0;

      // TODO this should scan in reverse for efficiency
      for (const message of conversation.messages) {
        if (new Date(conversation.userReadAt) < new Date(message.createdAt)) {
          count += 1;
        }
      }
      
      setUnread(count);
    }
  }, [conversation, conversation.messages, conversation.userReadAt]);

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {unread > 0 &&
        <Box>
          <span className={classes.unread}>{unread}</span>
        </Box>
      }
    </Box>
  );
};

export default ChatContent;
