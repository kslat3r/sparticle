import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Link from '@material-ui/core/Link';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Media } from 'react-media-player';
import ArticlePlayer from './ArticlePlayer';

const styles = theme => ({
  root: {

  },
  text: {
    marginLeft: theme.spacing(1)
  },
  button: {
    marginRight: theme.spacing(0)
  }
});

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
      <Link
        href={item.decodedUrl}
        target="_new"
      >
        <ListItemText
          className={classes.text}
          primary={item.decodedUrl}
          secondary={`${timeString} ${dateString}`}
        />
      </Link>
      <ListItemSecondaryAction>
        <Media>
          <ArticlePlayer
            item={item}
          />
        </Media>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

ArticleListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired
};

export default withStyles(styles)(ArticleListItem);
