import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = () => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    right: '50%',
    marginLeft: '-20px',
    marginTop: '-20px'
  }
});

const Loading = props => {
  const {
    classes
  } = props;

  return (
    <div
      className={classes.root}
    >
      <CircularProgress />
    </div>
  );
}

Loading.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Loading);
