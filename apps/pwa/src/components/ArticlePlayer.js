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
    marginLeft: theme.spacing(1)
  },
  buttonMargin: {
    zIndex: 2,
    marginRight: theme.spacing(0.5)
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

  componentDidMount () {
    const {
      id
    } = this.props.item;

    this.props.mediaStore.add(id, this.props.media)
  }

  onReady () {
    if (!this.state.ready) {
      this.setState({ ready: true });

      const {
        id
      } = this.props.item;

      this.props.mediaStore.onReady(id);
    }
  }

  onDelete () {
    const {
      token
    } = this.props.authorisationStore;

    const {
      id
    } = this.props.item;

    this.props.articlesStore.delete(token, id);
  }

  onReset () {
    const {
      id
    } = this.props.item;

    this.props.mediaStore.onReset(id, 0);
  }

  onClick () {
    const {
      id
    } = this.props.item;

    this.props.mediaStore.onPlayPause(id);
  }

  onTimeUpdate () {
    const {
      id
    } = this.props.item;

    this.props.mediaStore.onTimeUpdate(id, this.props.media.currentTime);
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
        {item.status !== 'completed' ? (
          <CircularProgress
            variant="indeterminate"
            size={48}
            thickness={4}
          />
        ) : null}

        {item.status === 'completed' ? (
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
            >
              <RestoreIcon />
            </IconButton>

            <IconButton
              className={classes.button}
              onClick={this.onClick}
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
                className={classes.progress}
                variant="determinate"
                size={48}
                thickness={4}
                value={playedDuration}
              />
            </div>

            <Player
              src={item.s3ObjectUrl}
              vendor="audio"
              autoPlay={false}
              onReady={this.onReady}
              onTimeUpdate={this.onTimeUpdate}
            />
          </React.Fragment>
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
