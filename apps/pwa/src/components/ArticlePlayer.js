import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { Player, withMediaProps } from 'react-media-player';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import RestoreIcon from '@material-ui/icons/Restore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  button: {
    zIndex: 2,
    marginLeft: theme.spacing(0)
  },
  buttonMargin: {
    zIndex: 2,
    marginRight: 12
  },
  progressContainer: {
    width: 48,
    textAlign: 'center',
    marginTop: -48,
    position: 'absolute',
    right: 0
  },
  progressBackground: {
    color: theme.palette.grey[200],
    position: 'relative',
  },
  progress: {
    position: 'relative',
    marginLeft: -48
  },
  failed: {
    color: theme.palette.secondary.main
  }
});

@inject('articlesStore')
@inject('authorisationStore')
@inject('mediaStore')
class ArticlePlayer extends React.Component {
  constructor (props) {
    super(props);

    this.onReady = this.onReady.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);

    this.state = { ready: false };
  }

  onReady () {
    if (!this.state.ready) {
      this.setState({ ready: true });

      const {
        item: {
          id
        },
        media
      } = this.props;

      this.props.mediaStore.onReady(id, media);
    }
  }

  onDelete () {
    const {
      articlesStore,
      authorisationStore: {
        token
      },
      item: {
        id
      },
      media
    } = this.props;

    media.pause();
    articlesStore.delete(token, id);
  }

  onReset () {
    const {
      item: {
        id
      },
      media
    } = this.props;

    this.props.mediaStore.onReset(id, media);
  }

  onClick () {
    const {
      item: {
        id
      },
      media,
      mediaStore
    } = this.props;

    mediaStore.onClick(id, media);
  }

  onTimeUpdate () {
    const {
      item: {
        id
      },
      media: {
        currentTime
      },
      mediaStore
    } = this.props;

    mediaStore.onTimeUpdate(id, currentTime);
  }

  render () {
    const {
      classes,
      item,
      media
    } = this.props;

    let playedDuration = 0;

    const {
      ready
    } = this.state;

    if (ready) {
      const {
        currentTime,
        duration
      } = media;

      playedDuration = (currentTime / duration) * 100;
    }

    return (
      <React.Fragment>
        <IconButton
          className={classes.button}
          onClick={this.onDelete}
        >
          <DeleteIcon />
        </IconButton>

        <IconButton
          className={classes.buttonMargin}
          onClick={this.onReset}
          disabled={item.pollyTaskStatus === 'COMPLETED' && item.s3ObjectAccessible ? false:  true}
        >
          <RestoreIcon />
        </IconButton>

        <IconButton
          className={classes.button}
          onClick={this.onClick}
          disabled={item.pollyTaskStatus === 'COMPLETED' && item.s3ObjectAccessible ? false:  true}
        >

          {media.isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayArrowIcon />
          )}
        </IconButton>

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

        {item.pollyTaskStatus === 'COMPLETED' && item.s3ObjectAccessible ? (
          <Player
            src={item.s3ObjectUrl}
            vendor="audio"
            autoPlay={false}
            onReady={this.onReady}
            onTimeUpdate={this.onTimeUpdate}
          />
        ) : null}
      </React.Fragment>
    );
  }
};

ArticlePlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  media: PropTypes.object.isRequired
};

export default withStyles(styles)(withMediaProps(ArticlePlayer));
