import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  menu: {
    '&:hover': {
      backgroundColor: '#fff'
    }
  }
});

@inject('articleStore')
@inject('authorisationStore')
class ArticleListItemMenu extends React.Component {
  constructor (props) {
    super(props);

    this.onMenuClick = this.onMenuClick.bind(this);
    this.onMenuClose = this.onMenuClose.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onFavourite = this.onFavourite.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.state = {
      menuOpen: false,
      menuAnchorEl: null
    };
  }

  onMenuClick (e) {
    e.preventDefault();

    this.setState({
      menuOpen: true,
      menuAnchorEl: e.currentTarget
    });
  }

  onMenuClose () {
    this.setState({
      menuOpen: false,
      menuAnchorEl: null
    });
  }

  onReset () {
    const {
      articleStore,
      item
    } = this.props;

    articleStore.reset(item);
    this.onMenuClose();
  }

  onFavourite (isFavourite) {
    const {
      articleStore,
      authorisationStore: {
        token
      },
      item,
    } = this.props;

    articleStore.favourite(item, token, isFavourite);
    this.onMenuClose();
  }

  onDelete () {
    const {
      articleStore,
      authorisationStore: {
        token
      },
      item
    } = this.props;

    articleStore.delete(item, token);
    this.onMenuClose();
  }

  render () {
    const {
      classes,
      item
    } = this.props;

    const {
      menuOpen,
      menuAnchorEl
    } = this.state;

    return (
      <React.Fragment>
        <IconButton
          disableFocusRipple
          disableRipple
          onClick={this.onMenuClick}
          className={classes.menu}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={menuAnchorEl}
          keepMounted
          open={menuOpen}
          onClose={this.onMenuClose}
        >
          <MenuItem
            onClick={this.onReset}
          >
            Reset
          </MenuItem>

          {!item.deleted && !item.favourite ? (
            <MenuItem
              onClick={() => this.onFavourite(true)}
            >
              Favourite
            </MenuItem>
          ) : null}

          {!item.deleted && item.favourite ? (
            <MenuItem
              onClick={() => this.onFavourite(false)}
            >
              Unfavourite
            </MenuItem>
          ) : null}

          {!item.deleted ? (
            <MenuItem
              onClick={this.onDelete}
            >
              Delete
            </MenuItem>
          ) : null}
        </Menu>
      </React.Fragment>
    );
  }
};

ArticleListItemMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired
};

export default withStyles(styles)(ArticleListItemMenu);
