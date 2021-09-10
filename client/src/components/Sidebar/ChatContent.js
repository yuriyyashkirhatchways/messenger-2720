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
  previewTextUnread: {
    fontSize: 12,
    fontWeight: 'bold',
    color: "#000000",
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

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={conversation.unread ? classes.previewTextUnread : classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {conversation.unread > 0 &&
        <Box>
          <Box className={classes.unread}>{conversation.unread}</Box>
        </Box>
      }
    </Box>
  );
};

export default ChatContent;
