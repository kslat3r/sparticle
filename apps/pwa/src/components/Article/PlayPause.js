import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  button: {
    zIndex: 2
  },
  progressContainer: {
    position: 'absolute',
    width: 48,
    marginTop: -48
  },
  progressBackground: {
    position: 'relative',
    color: theme.palette.grey[200]
  },
  progress: {
    position: 'relative',
    marginLeft: -48
  },
  failed: {
    color: theme.palette.secondary.main
  }
});

@inject('articleStore')
@inject('authorisationStore')
@observer
class ArticleListItemPlayer extends React.Component {
  constructor (props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick () {
    const {
      articleStore,
      item
    } = this.props;

    articleStore.playPause(item);
  }

  render () {
    const {
      classes,
      item,
      item: {
        s3ObjectElapsed,
        s3ObjectDuration
      },
      articleStore: {
        selected,
        isPlaying
      }
    } = this.props;

    let playedDuration;

    if (s3ObjectDuration) {
      playedDuration = (s3ObjectElapsed / s3ObjectDuration) * 100;
    }

    return (
      <React.Fragment>
        <IconButton
          className={classes.button}
          onClick={this.onClick}
          disabled={item.pollyTaskStatus === 'COMPLETED' && item.s3ObjectAccessible ? false:  true}
        >

          {selected && selected.id === item.id && isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayArrowIcon />
          )}
        </IconButton>

        {playedDuration !== undefined || (item.pollyStatus !== 'COMPLETED' || !item.s3ObjectAccessible) ? (
          <div
            className={classes.progressContainer}
          >
            <CircularProgress
              className={classes.progressBackground}
              variant="determinate"
              size={48}
              thickness={4}
              value={100}
            />

            <CircularProgress
              className={item.pollyTaskStatus === 'FAILED' ? [classes.progress, classes.failed].join(' ') : classes.progress}
              variant={(item.pollyTaskStatus === 'COMPLETED' && item.s3ObjectAccessible) || item.pollyTaskStatus === 'FAILED' ? 'determinate' : 'indeterminate'}
              size={48}
              thickness={4}
              value={item.pollyTaskStatus === 'FAILED' ? 100 : playedDuration}
            />
          </div>
        ) : null}
      </React.Fragment>
    );
  }
};

ArticleListItemPlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired
};

export default withStyles(styles)(ArticleListItemPlayer);
