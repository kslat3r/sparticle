import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    margin: theme.spacing(2)
  }
});

const InfoDialog = props => {
  const {
    title,
    message,
    classes
  } = props;

  return (
    <div>
      <Paper
        className={classes.root}
        elevation={1}
      >
        <Typography
          variant="h5"
          component="h3"
        >
          {title}
        </Typography>
        <Typography
          component="p"
        >
          {message}
        </Typography>
      </Paper>
    </div>
  );
};

InfoDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default withStyles(styles)(InfoDialog)
