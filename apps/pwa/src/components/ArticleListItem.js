import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
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
  },
  inline: {
    display: 'inline',
  },
  deleted: {
    backgroundColor: 'red'
  }
});

@inject('articlesStore')
@observer
class ArticleListItem extends React.Component {
  render () {
    const {
      classes,
      item
    } = this.props;

    const created = item.created;
    const date = new Date(created);
    const timeString = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
      <Collapse
        in={item.deleted ? false : true}
      >
        <ListItem>
          <Grid
            container
          >
            <Grid
              item
              xs={7}
            >
              <Link
                href={item.decodedUrl}
                target="_new"
              >
                <ListItemText
                  className={classes.text}
                  primary={`${item.siteName} - ${item.title}`}
                  secondary={`${timeString} ${dateString}`}
                />
              </Link>
            </Grid>
            <Grid
              item
              xs={5}
            >
              <ListItemSecondaryAction>
                <Media>
                  <ArticlePlayer
                    item={item}
                  />
                </Media>
              </ListItemSecondaryAction>
            </Grid>
          </Grid>
        </ListItem>
      </Collapse>
    );
  }
};

ArticleListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired
};

export default withStyles(styles)(ArticleListItem);
