

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactPlayer from 'react-player';
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

class VoicePreview extends React.Component {
  constructor (props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onEnded = this.onEnded.bind(this);

    this.state = {
      playing: false
    };
  }

  onClick (e) {
    e.stopPropagation();

    this.setState({
      playing: true
    });
  }

  onEnded () {
    this.setState({
      playing: false
    });
  }

  render () {
    const {
      voice,
      url,
      onSelection,
      classes,
      selected
    } = this.props;

    const {
      playing
    } = this.state;

    return (
      <MenuItem
        onClick={() => onSelection(voice)}
        selected={selected}
      >
        <ListItemIcon
          className={classes.icon}
        >
          <IconButton
            onClick={this.onClick}
            className={classes.button}
            disableFocusRipple={true}
            disableRipple={true}
          >
            {playing ? (
              <PauseIcon />
            ) : (
              <PlayArrowIcon />
            )}
          </IconButton>
        </ListItemIcon>

        <ListItemText
          primary={voice}
        />

        <ReactPlayer
          width={0}
          height={0}
          url={url}
          playing={playing}
          onEnded={this.onEnded}
        />
      </MenuItem>
    );
  }
}

VoicePreview.propTypes = {
  selected: PropTypes.bool.isRequired,
  voice: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired
};

export default withStyles(styles)(VoicePreview);
