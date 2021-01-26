import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { Player, withMediaProps } from 'react-media-player';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import CircularProgress from '@material-ui/core/CircularProgress';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

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
  },
  menu: {
    '&:hover': {
      backgroundColor: '#fff'
    }
  }
});

@inject('articlesStore')
@inject('authorisationStore')
@inject('playerStore')
class ArticlePlayer extends React.Component {
  constructor (props) {
    super(props);

    this.onReady = this.onReady.bind(this);
    this.onMenuClick = this.onMenuClick.bind(this);
    this.onMenuClose = this.onMenuClose.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);

    this.state = {
      ready: false,
      menuOpen: false,
      menuAnchorEl: null
    };
  }

  onReady () {
    if (!this.state.ready) {
      this.setState({ ready: true });

      const {
        item: {
          id,
          created
        },
        media
      } = this.props;

      this.props.playerStore.onReady(id, media, created );
    }
  }

  onMenuClick (e) {
    e.preventDefault();

    this.setState({
      menuOpen: true,
      menuAnchorEl: e.currentTarget
    });
  }

  onMenuClose () {
    this.setState({
      menuOpen: false,
      menuAnchorEl: null
    });
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

    this.onMenuClose();
  }

  onReset () {
    const {
      item: {
        id
      },
      media
    } = this.props;

    this.props.playerStore.onReset(id, media);

    this.onMenuClose();
  }

  onClick () {
    const {
      item: {
        id
      },
      media,
      playerStore
    } = this.props;

    playerStore.onClick(id, media);
  }

  onTimeUpdate () {
    const {
      item: {
        id
      },
      media: {
        currentTime,
        duration
      },
      playerStore
    } = this.props;

    playerStore.onTimeUpdate(id, currentTime, duration);
  }

  render () {
    const {
      classes,
      item,
      media
    } = this.props;

    let playedDuration = 0;

    const {
      ready,
      menuOpen,
      menuAnchorEl
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

        <IconButton
          disableFocusRipple
          disableRipple
          onClick={this.onMenuClick}
          className={classes.menu}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={menuAnchorEl}
          keepMounted
          open={menuOpen}
          onClose={this.onMenuClose}
        >
          <MenuItem
            onClick={this.onReset}
          >
            Reset
          </MenuItem>

          <MenuItem
            onClick={this.onDelete}
          >
            Delete
          </MenuItem>
        </Menu>

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
