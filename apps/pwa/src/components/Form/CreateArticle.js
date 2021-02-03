import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import SpeedIcon from '@material-ui/icons/Speed';
import Menu from '@material-ui/core/Menu';
import VoicePreview from './VoicePreview';
import SpeedPreview from './SpeedPreview';

const styles = theme => ({
  root: {
    margin: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  }
});

class CreateArticleForm extends React.Component {
  constructor (props) {
    super(props);

    this.onUrlSelection = this.onUrlSelection.bind(this);
    this.onSpeedMenuClick = this.onSpeedMenuClick.bind(this);
    this.onSpeedMenuClose = this.onSpeedMenuClose.bind(this);
    this.onSpeedSelection = this.onSpeedSelection.bind(this);
    this.onVoiceMenuClick = this.onVoiceMenuClick.bind(this);
    this.onVoiceMenuClose = this.onVoiceMenuClose.bind(this);
    this.onVoiceSelection = this.onVoiceSelection.bind(this);

    this.state = {
      speedMenuOpen: false,
      speedMenuAnchorEl: null,
      voiceMenuOpen: false,
      voiceMenuAnchorEl: null,
      url: '',
      voice: 'Amy',
      speed: 100
    };
  }

  onUrlSelection (e) {
    const url = e.target.value;

    this.setState({
      menuOpen: false,
      menuAnchorEl: null,
      url
    });

    const {
      index,
      onChange
    } = this.props;

    const {
      voice,
      speed
    } = this.state

    onChange(index, { url, voice, speed });
  }

  onSpeedMenuClick (e) {
    e.preventDefault();

    this.setState({
      speedMenuOpen: true,
      speedMenuAnchorEl: e.currentTarget
    });
  }

  onSpeedMenuClose () {
    this.setState({
      speedMenuOpen: false,
      speedMenuAnchorEl: null
    });
  }

  onSpeedSelection (speed) {
    this.setState({
      speedMenuOpen: false,
      speedMenuAnchorEl: null,
      speed
    });

    const {
      index,
      onChange
    } = this.props;

    const {
      url,
      voice
    } = this.state

    onChange(index, { url, voice, speed });
  }

  onVoiceMenuClick (e) {
    e.preventDefault();

    this.setState({
      voiceMenuOpen: true,
      voiceMenuAnchorEl: e.currentTarget
    });
  }

  onVoiceMenuClose () {
    this.setState({
      voiceMenuOpen: false,
      voiceMenuAnchorEl: null
    });
  }

  onVoiceSelection (voice) {
    this.setState({
      voiceMenuOpen: false,
      voiceMenuAnchorEl: null,
      voice
    });

    const {
      index,
      onChange
    } = this.props;

    const {
      url,
      speed
    } = this.state

    onChange(index, { url, voice, speed });
  }

  render () {
    const {
      classes
    } = this.props;

    const {
      voiceMenuOpen,
      voiceMenuAnchorEl,
      speedMenuOpen,
      speedMenuAnchorEl,
      url,
      voice,
      speed
    } = this.state;

    return (
      <div
        className={classes.root}
      >
        <Paper
          elevation={3}
          className={classes.paper}
        >
          <TextField
            className={classes.input}
            label="Article URL"
            helperText="Paste your article link in here"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={this.onUrlSelection}
            value={url}
          />

          <IconButton
            color="secondary"
            className={classes.iconButton}
            onClick={this.onSpeedMenuClick}
          >
            <SpeedIcon />
          </IconButton>

          <Menu
            anchorEl={speedMenuAnchorEl}
            keepMounted
            open={speedMenuOpen}
            onClose={this.onSpeedMenuClose}
          >
            {[120, 115, 110, 105, 100, 95, 90, 85, 80].map((val, i) => (
              <SpeedPreview
                key={i}
                selected={speed === val}
                value={val}
                onSelection={this.onSpeedSelection}
              />
            ))}
          </Menu>

          <IconButton
            color="secondary"
            className={classes.iconButton}
            onClick={this.onVoiceMenuClick}
          >
            <RecordVoiceOverIcon />
          </IconButton>

          <Menu
            anchorEl={voiceMenuAnchorEl}
            keepMounted
            open={voiceMenuOpen}
            onClose={this.onVoiceMenuClose}
          >
            <VoicePreview
              selected={voice === 'Amy'}
              url="https://s3.eu-west-2.amazonaws.com/sparticle-engine-prod-audio/6bf55160-f0a7-4ada-99d4-a98ddcf65329.mp3"
              value="Amy"
              onSelection={this.onVoiceSelection}
            />

            <VoicePreview
              selected={voice === 'Emma'}
              url="https://s3.eu-west-2.amazonaws.com/sparticle-engine-prod-audio/9108986d-4f87-46a1-9722-77c4873426cc.mp3"
              value="Emma"
              onSelection={this.onVoiceSelection}
            />

            <VoicePreview
              selected={voice === 'Brian'}
              url="https://s3.eu-west-2.amazonaws.com/sparticle-engine-prod-audio/d56dccdb-ab90-4f8e-aa2f-8d6a82d06d59.mp3"
              value="Brian"
              onSelection={this.onVoiceSelection}
            />
          </Menu>
        </Paper>
      </div>
    );
  };
};

CreateArticleForm.propTypes = {
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreateArticleForm);
