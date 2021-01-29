import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ArchiveIcon from '@material-ui/icons/Archive';
import withAuthorisation from '../helpers/withAuthorisation';
import Toolbar from './Toolbar';
import LoadingDialog from './Dialog/Loading';
import ErrorDialog from './Dialog/Error';
import InfoDialog from './Dialog/Info';
import ArticleList from './Article/List';

const styles = theme => ({
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1202,
    borderTop: '1px solid rgba(0, 0, 0, 0.12)'
  }
});

@inject('articleStore')
@inject('authorisationStore')
@inject('routingStore')
@observer
class Articles extends React.Component {
  constructor (props) {
    super(props);

    this.onToolbarRightClick = this.onToolbarRightClick.bind(this);
    this.onNavChange = this.onNavChange.bind(this);
  }

  componentDidMount () {
    const {
      articleStore,
      type,
      authorisationStore: {
        token
      }
    } = this.props;

    articleStore.fetch(type, token);
  }

  onToolbarRightClick (e) {
    e.preventDefault();

    const {
      routingStore
    } = this.props;

    routingStore.push('/articles/create');
  }

  onNavChange (e, type) {
    e.preventDefault();

    const {
      routingStore,
      articleStore,
      authorisationStore: {
        token
      }
    } = this.props;

    routingStore.push(`/articles/${type}`);
    articleStore.fetch(type, token);
  }

  render () {
    const {
      articleStore: {
        requesting,
        error,
        items
      },
      type,
      showDeleted,
      classes
    } = this.props;

    let infoMsg;

    switch (type) {
      case 'favourites':
        infoMsg = 'You don\'t have any favourited articles right now';
        break;
      case 'archived':
        infoMsg = 'You don\'t have any archived articles';
        break;
      default:
        infoMsg = 'You don\'t have any articles articles right now';
        break;
    }

    return (
      <React.Fragment>
        <Toolbar
          rightText="Add articles"
          onRightClick={this.onToolbarRightClick}
        />

        {requesting ? (
          <LoadingDialog />
        ) : null}

        {error ? (
          <ErrorDialog
            message={error}
          />
        ) : null}

        {!requesting && !items.length ? (
          <InfoDialog
            title={infoMsg}
            message="Click the button in the top right to add a new article"
          />
        ) : null}

        {!requesting && items.length ? (
          <ArticleList
            items={items}
            showDeleted={showDeleted}
          />
        ) : null}

        <BottomNavigation
          value={type}
          onChange={this.onNavChange}
          showLabels
          className={classes.nav}
        >
          <BottomNavigationAction
            label="Recent"
            icon={<RestoreIcon />}
            value="recent"
          />
          <BottomNavigationAction
            label="Favorites"
            icon={<FavoriteIcon />}
            value="favourites"
          />
          <BottomNavigationAction
            label="Archived"
            icon={<ArchiveIcon />}
            value="archived"
          />
        </BottomNavigation>
      </React.Fragment>
    )
  }
};

Articles.propTypes = {
  type: PropTypes.string.isRequired,
  showDeleted: PropTypes.bool.isRequired
};

export default withAuthorisation(withStyles(styles)(Articles));
