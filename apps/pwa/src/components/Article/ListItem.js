import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import StarIcon from '@material-ui/icons/Star';
import Link from '@material-ui/core/Link';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ArticlePlayPause from './PlayPause';
import ArticleMenu from './Menu';

const styles = theme => ({
  favourite: {
    display: 'inline',
    verticalAlign: -3,
    marginRight: 2,
    marginLeft: -2
  },
  secondary: {
    marginRight: 0,
    right: 0
  },
  time: {
    marginLeft: 5,
    fontSize: '80%'
  }
});

@inject('articleStore')
@observer
class ArticleListItem extends React.Component {
  render () {
    const {
      classes,
      item,
      showDeleted
    } = this.props;

    const created = item.created;
    const date = new Date(created);
    const timeString = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

    let duration;
    let minutes;
    let seconds;

    if (item.s3ObjectDuration) {
      duration = item.s3ObjectDuration;
      minutes = Math.floor(duration / 60);
      seconds = Math.ceil(duration - minutes * 60);
    }

    return showDeleted || !item.deleted ? (
      <ListItem
        divider
      >
        <Grid
          container
        >
          <Grid
            item
            xs={8}
          >
            <Link
              href={item.decodedUrl}
              target="_new"
            >
              <ListItemText
                className={classes.text}
                primary={
                  <React.Fragment>
                    {item.favourite && !item.deleted ? (
                      <StarIcon
                        className={classes.favourite}
                        color="secondary"
                        fontSize="small"
                      />
                    ) : null}

                    <span>
                      {item.title}
                    </span>

                    {duration ? (
                      <span
                        className={classes.time}
                      >
                        ({minutes}m {seconds}s)
                      </span>
                    ) : null}
                  </React.Fragment>
                }
                secondary={`Added ${timeString} ${dateString}`}
              />
            </Link>
          </Grid>
          <Grid
            item
            xs={4}
          >
            <ListItemSecondaryAction
              className={classes.secondary}
            >
              <ArticlePlayPause
                item={item}
              />

              <ArticleMenu
                item={item}
              />
            </ListItemSecondaryAction>
          </Grid>
        </Grid>
      </ListItem>
    ) : null;
  }
};

ArticleListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  showDeleted: PropTypes.bool.isRequired
};

export default withStyles(styles)(ArticleListItem);
