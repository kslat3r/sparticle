import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  root: {
    margin: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(2)
  }
});

const CreateArticleForm = props => {
  const {
    classes,
    index,
    onBlur
  } = props;

  return (
    <div
      className={classes.root}
    >
      <Paper
        elevation={3}
        className={classes.paper}
      >
        <TextField
          label="Article URL"
          helperText="Paste your article link in here"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          onBlur={(e) => onBlur(index, e.target.value)}
        />
      </Paper>
    </div>
  );
};

CreateArticleForm.propTypes = {
  index: PropTypes.number.isRequired,
  onBlur: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreateArticleForm);
