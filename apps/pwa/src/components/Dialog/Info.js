import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';

const styles = theme => ({
  root: {
    margin: theme.spacing(1)
  },
});

const InfoDialog = props => {
  const {
    classes,
    title,
    message
  } = props;

  return (
    <div
      className={classes.root}
    >
      <Alert
        severity="info"
      >
        <AlertTitle>
          {title}
        </AlertTitle>

        {message}
      </Alert>
    </div>
  );
};

InfoDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default withStyles(styles)(InfoDialog)
