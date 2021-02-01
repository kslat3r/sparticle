import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';

const styles = theme => ({
  root: {
    margin: theme.spacing(1)
  },
});

const ErrorDialog = props => {
  const {
    classes,
    message
  } = props;

  return (
    <div
      className={classes.root}
    >
      <Alert
        severity="error"
      >
        <AlertTitle>
          Error
        </AlertTitle>

        {message}
      </Alert>
    </div>
  );
};

ErrorDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired
};

export default withStyles(styles)(ErrorDialog)
