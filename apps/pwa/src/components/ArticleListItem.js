import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const styles = theme => ({
  root: {

  },
  text: {
    marginLeft: theme.spacing(1)
  },
  button: {
    marginRight: theme.spacing(0)
  }
})

const ArticleListItem = props => {
  const {
    classes,
    item
  } = props;

  const created = item.created;
  const date = new Date(created);
  const timeString = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const dateString = date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <ListItem>
      <ListItemText
        className={classes.text}
        primary={item.decodedUrl}
        secondary={`${timeString} ${dateString}`}
      />
      <ListItemSecondaryAction>
        <IconButton
          className={classes.button}
        >
          <PlayArrowIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

ArticleListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired
};

export default withStyles(styles)(ArticleListItem);
