import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({

});

class SpeedPreview extends React.Component {
  render () {
    const {
      value,
      onSelection,
      selected
    } = this.props;

    return (
      <MenuItem
        onClick={() => onSelection(value)}
        selected={selected}
      >
        <ListItemText
          primary={`${value}%`}
        />
      </MenuItem>
    );
  }
}

SpeedPreview.propTypes = {
  selected: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
  onSelection: PropTypes.func.isRequired
};

export default withStyles(styles)(SpeedPreview);
