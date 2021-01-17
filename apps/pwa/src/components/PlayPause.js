import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withMediaProps } from 'react-media-player';

const styles = theme => ({
  button: {
    marginRight: theme.spacing(0)
  }
});

class CustomPlayPause extends Component {
  constructor (props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick = () => {
    this.props.media.playPause()
  }

  render() {
    const {
      classes,
      media
    } = this.props;

    return (

    );
  }
}

CustomPlayPause.propTypes = {
  classes: PropTypes.object.isRequired,
  media: PropTypes.object.isRequired
};

export default withMediaProps(withStyles(styles)(CustomPlayPause));
