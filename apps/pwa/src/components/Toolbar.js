import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  backButton: {
    color: '#fff'
  },
  title: {
    flexGrow: 1,
  },
});

class ComponentWithToolbar extends React.Component {
  render () {
    const {
      classes,
      onBackClick,
      rightText,
      onRightClick
    } = this.props

    return (
      <AppBar
        position="static"
      >
        <Toolbar>
          {onBackClick ? (
            <IconButton
              edge="start"
              className={classes.backButton}
              onClick={onBackClick}
            >
              <ArrowBackIcon />
            </IconButton>
          ) : null}

          <Typography
            variant="h6"
            className={classes.title}
          >
            Sparticle
          </Typography>

          {rightText && onRightClick ? (
            <Button
              color="inherit"
              onClick={onRightClick}
            >
              {rightText}
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>
    );
  }
}

ComponentWithToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  onBackClick: PropTypes.func,
  rightText: PropTypes.string,
  onRightClick: PropTypes.func
};

export default withStyles(styles)(ComponentWithToolbar);
