import React from 'react';
import PropTypes from 'prop-types';
import withAuthorisation from '../helpers/withAuthorisation';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import ReactPlayer from 'react-player';
import IconButton from '@material-ui/core/IconButton';
import ReplayIcon from '@material-ui/icons/Replay';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Forward30Icon from '@material-ui/icons/Forward30';
import Slider from '@material-ui/core/Slider';

const styles = (theme) => ({
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1202,
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: theme.palette.grey[200],
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6)
  },
  button: {
    color: '#fff',
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      color: theme.palette.secondary.main,
      backgroundColor: '#fff'
    },
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  smallButton: {
    padding: 8
  },
  inner: {
    width: '100%',
    textAlign: 'center'
  }
});

@inject('articleStore')
@observer
class Player extends React.Component {
  constructor (props) {
    super(props);

    this.setReference = this.setReference.bind(this);
    this.onRewindButtonClick = this.onRewindButtonClick.bind(this);
    this.onPlayButtonClick = this.onPlayButtonClick.bind(this);
    this.onFastForwardButtonClick = this.onFastForwardButtonClick.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onSeekMouseDown = this.onSeekMouseDown.bind(this);
    this.onSeek = this.onSeek.bind(this);
    this.onSeekMouseUp = this.onSeekMouseUp.bind(this);

    this.state = {
      player: null,
      seeking: false
    }
  }

  componentDidUpdate () {
    const {
      articleStore: {
        isPlayerShown
      }
    } = this.props;

    // add class

    if (isPlayerShown) {
      document.body.classList.add('has-player');
    } else {
      document.body.classList.remove('has-player');
    }
  }

  setReference (player) {
    this.setState({ player });
  }

  onRewindButtonClick () {
    const {
      articleStore,
      articleStore: {
        selected
      }
    } = this.props;

    const {
      player
    } = this.state;

    articleStore.seek(selected, 0);
    player.seekTo(0);
  }

  onPlayButtonClick () {
    const {
      articleStore,
      articleStore: {
        selected
      }
    } = this.props

    articleStore.playPause(selected);
  }

  onFastForwardButtonClick () {
    const {
      articleStore,
      articleStore: {
        selected
      }
    } = this.props;

    const {
      player
    } = this.state;

    const newS3ObjectElapsed = selected.s3ObjectElapsed + 30;

    articleStore.seek(selected, newS3ObjectElapsed);
    player.seekTo(parseFloat(newS3ObjectElapsed));
  }

  onPlay () {
    const {
      articleStore: {
        selected
      }
    } = this.props

    const {
      player
    } = this.state;

    player.seekTo(selected.s3ObjectElapsed !== undefined ? parseFloat(selected.s3ObjectElapsed) : 0);
  }

  onProgress (e) {
    const {
      articleStore,
      articleStore: {
        selected
      }
    } = this.props;

    const {
      seeking
    } = this.state;

    if (!seeking) {
      articleStore.seek(selected, e.playedSeconds, false);

      if (e.played === 1) {
        articleStore.stop(selected);
      }
    }
  }

  onSeekMouseDown () {
    this.setState({ seeking: true });
  }

  onSeek (e, value) {
    const {
      articleStore,
      articleStore: {
        selected
      }
    } = this.props;

    articleStore.seek(selected, parseFloat(value));
  }

  onSeekMouseUp () {
    this.setState({ seeking: false });

    const {
      articleStore: {
        selected
      }
    } = this.props

    const {
      player
    } = this.state;

    player.seekTo(selected.s3ObjectElapsed !== undefined ? parseFloat(selected.s3ObjectElapsed) : 0);
  }

  render () {
    const {
      classes,
      children,
      articleStore: {
        isPlayerShown,
        isPlaying,
        selected
      }
    } = this.props

    let marks = [];

    if (selected) {
      if (selected.s3ObjectElapsed) {
        const elapsed = selected.s3ObjectElapsed;
        const elapsedMinutes = Math.floor(elapsed / 60);
        const elapsedSeconds = Math.ceil(elapsed - elapsedMinutes * 60);

        marks.push({ value: 0, label: `${elapsedMinutes}m ${elapsedSeconds}s` });
      } else {
        marks.push({ value: 0, label: `0m 0s` });
      }

      if (selected.s3ObjectDuration) {
        const duration = selected.s3ObjectDuration;
        const durationMinutes = Math.floor(duration / 60);
        const durationSeconds = Math.ceil(duration - durationMinutes * 60);

        marks.push({ value: selected.s3ObjectDuration / 2, label: selected.title });
        marks.push({ value: selected.s3ObjectDuration, label: `${durationMinutes}m ${durationSeconds}s`});
      } else {
        marks.push({ value: 50, label: selected.title });
        marks.push({ value: 100, label: '100%' });
      }
    }

    return (
      <React.Fragment>
        {children}

        {isPlayerShown ? (
          <React.Fragment>
            <div
              className={classes.container}
            >
              <div
                className={classes.inner}
              >
                <IconButton
                  className={[classes.button, classes.smallButton].join(' ')}
                  onClick={this.onRewindButtonClick}
                >
                  <ReplayIcon />
                </IconButton>

                <IconButton
                  className={classes.button}
                  onClick={this.onPlayButtonClick}
                >

                  {isPlaying ? (
                    <PauseIcon />
                  ) : (
                    <PlayArrowIcon />
                  )}
                </IconButton>

                <IconButton
                className={[classes.button, classes.smallButton].join(' ')}
                  onClick={this.onFastForwardButtonClick}
                >
                  <Forward30Icon />
                </IconButton>
              </div>

              <div
                className={classes.inner}
              >
                <Slider
                  value={selected.s3ObjectElapsed}
                  min={0}
                  max={selected.s3ObjectDuration}
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeek}
                  onMouseUp={this.onSeekMouseUp}
                  color="secondary"
                  marks={marks}
                  className={classes.slider}
                />
              </div>
            </div>

            <ReactPlayer
              ref={this.setReference}
              height={0}
              width={0}
              url={selected.s3ObjectUrl}
              playing={isPlaying}
              loop={false}
              onPlay={this.onPlay}
              onProgress={this.onProgress}
            />
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

Player.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default withAuthorisation(withStyles(styles)(Player));
