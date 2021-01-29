

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Player, withMediaProps } from 'react-media-player';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
  icon: {
    minWidth: 0,
    marginRight: theme.spacing(1)
  },
  button: {
    marginLeft: theme.spacing(1) * -1,
    marginTop: -3,
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent'
    }
  }
});

const VoicePreview = (props) => {
  const {
    media,
    voice,
    url,
    onSelection,
    classes,
    selected
  } = props;

  const onVoiceMenuClick = (e) => {
    e.stopPropagation();

    media.playPause();
  };

  return (
    <MenuItem
      onClick={() => onSelection(voice)}
      selected={selected}
    >
      <ListItemIcon
        className={classes.icon}
      >
        <IconButton
          onClick={onVoiceMenuClick}
          className={classes.button}
          disableFocusRipple={true}
          disableRipple={true}
        >
          {media.isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayArrowIcon />
          )}
        </IconButton>
      </ListItemIcon>

      <ListItemText
        primary={voice}
      />

      <Player
        src={url}
        vendor="audio"
        autoPlay={false}
      />
    </MenuItem>
  );
}

VoicePreview.propTypes = {
  selected: PropTypes.bool.isRequired,
  media: PropTypes.object.isRequired,
  voice: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired
};

export default withMediaProps(withStyles(styles)(VoicePreview));
