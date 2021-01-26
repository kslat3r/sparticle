import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import Menu from '@material-ui/core/Menu';
import { Media } from 'react-media-player';
import VoicePreview from './VoicePreview';

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
    this.onVoiceMenuClick = this.onVoiceMenuClick.bind(this);
    this.onVoiceMenuClose = this.onVoiceMenuClose.bind(this);
    this.onVoiceSelection = this.onVoiceSelection.bind(this);

    this.state = {
      menuOpen: false,
      menuAnchorEl: null,
      url: '',
      voice: 'Amy'
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
      voice
    } = this.state

    onChange(index, { url, voice });
  }

  onVoiceMenuClick (e) {
    e.preventDefault();

    this.setState({
      menuOpen: true,
      menuAnchorEl: e.currentTarget
    });
  }

  onVoiceMenuClose () {
    this.setState({
      menuOpen: false,
      menuAnchorEl: null
    });
  }

  onVoiceSelection (voice) {
    this.setState({
      menuOpen: false,
      menuAnchorEl: null,
      voice
    });

    const {
      index,
      onChange
    } = this.props;

    const {
      url
    } = this.state

    onChange(index, { url, voice });
  }

  render () {
    const {
      classes
    } = this.props;

    const {
      menuOpen,
      menuAnchorEl,
      url,
      voice
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
            onClick={this.onVoiceMenuClick}
          >
            <RecordVoiceOverIcon />
          </IconButton>

          <Menu
            anchorEl={menuAnchorEl}
            keepMounted
            open={menuOpen}
            onClose={this.onVoiceMenuClose}
          >
            <Media>
              <VoicePreview
                selected={voice === 'Amy'}
                url="https://s3.eu-west-2.amazonaws.com/sparticle-engine-prod-audio/6bf55160-f0a7-4ada-99d4-a98ddcf65329.mp3"
                voice="Amy"
                onSelection={this.onVoiceSelection}
              />
            </Media>

            <Media>
              <VoicePreview
                selected={voice === 'Emma'}
                url="https://s3.eu-west-2.amazonaws.com/sparticle-engine-prod-audio/9108986d-4f87-46a1-9722-77c4873426cc.mp3"
                voice="Emma"
                onSelection={this.onVoiceSelection}
              />
            </Media>

            <Media>
              <VoicePreview
                selected={voice === 'Brian'}
                url="https://s3.eu-west-2.amazonaws.com/sparticle-engine-prod-audio/d56dccdb-ab90-4f8e-aa2f-8d6a82d06d59.mp3"
                voice="Brian"
                onSelection={this.onVoiceSelection}
              />
            </Media>
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
