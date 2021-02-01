import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import ReactPlayer from 'react-player';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

const styles = (theme) => ({
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1202,
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
});

@inject('articleStore')
@observer
class Player extends React.Component {
  constructor (props) {
    super(props);

    this.setReference = this.setReference.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onProgress = this.onProgress.bind(this);

    this.state = {
      player: null
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

  onClick (e) {
    const {
      articleStore,
      articleStore: {
        selected
      }
    } = this.props

    articleStore.playPause(selected);
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

    player.seekTo(parseFloat(selected.currentTime));
  }

  onProgress (e) {
    const {
      articleStore,
      articleStore: {
        selected
      }
    } = this.props;

    articleStore.playing(selected, e.playedSeconds);

    if (e.played === 1) {
      articleStore.stop(selected);
    }
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

    return (
      <React.Fragment>
        {children}

        {isPlayerShown ? (
          <React.Fragment>
            <div
              className={classes.container}
            >
              <IconButton
                className={classes.button}
                onClick={this.onClick}
              >

                {isPlaying ? (
                  <PauseIcon />
                ) : (
                  <PlayArrowIcon />
                )}
              </IconButton>
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

export default withStyles(styles)(Player);
