import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});

const LoadingDialog = props => {
  const {
    classes
  } = props;

  return (
    <Backdrop
      className={classes.backdrop}
      open={true}
    >
      <CircularProgress />
    </Backdrop>
  );
}

LoadingDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoadingDialog);
