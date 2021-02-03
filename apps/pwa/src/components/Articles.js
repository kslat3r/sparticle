import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import withAuthorisation from '../helpers/withAuthorisation';
import Toolbar from './Toolbar';
import LoadingDialog from './Dialog/Loading';
import ErrorDialog from './Dialog/Error';
import InfoDialog from './Dialog/Info';
import ArticleList from './Article/List';

const styles = theme => ({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2
  }
});

@inject('articleStore')
@inject('routingStore')
@observer
class Articles extends React.Component {
  componentDidMount () {
    const {
      articleStore,
      type
    } = this.props;

    articleStore.fetch(type);
  }

  render () {
    const {
      articleStore: {
        requesting,
        error,
        items
      },
      type,
      showDeleted
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
          showBack={false}
          showFeedback={true}
          showAddArticles={true}
          showTabs={true}
          type={type}
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
      </React.Fragment>
    )
  }
};

Articles.propTypes = {
  type: PropTypes.string.isRequired,
  showDeleted: PropTypes.bool.isRequired
};

export default withAuthorisation(withStyles(styles)(Articles));
