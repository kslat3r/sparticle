import React from 'react';
import { inject, observer } from 'mobx-react';
import Toolbar from '../components/Toolbar';
import LoadingDialog from '../components/LoadingDialog';
import ErrorDialog from '../components/ErrorDialog';
import InfoDialog from '../components/InfoDialog';
import ArticleList from '../components/ArticleList';
import withAuthorisation from '../helpers/withAuthorisation';

@inject('articlesStore')
@inject('authorisationStore')
@inject('routingStore')
@observer
class Articles extends React.Component {
  constructor (props) {
    super(props);

    this.onRightClick = this.onRightClick.bind(this);
  }

  componentDidMount () {
    this.props.articlesStore.fetch(this.props.authorisationStore.token);
  }

  onRightClick (e) {
    e.preventDefault();

    this.props.routingStore.push('/articles/create');
  }

  render () {
    const {
      requesting,
      error,
      items
    } = this.props.articlesStore;

    return (
      <React.Fragment>
        <Toolbar
          rightText="Add new article"
          onRightClick={this.onRightClick}
        />

        <h1>Hello, world! 2</h1>

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
            title="You don't have any articles right now"
            message="Click the button in the top right to add a new article"
          />
        ) : null}

        {!requesting && items.length ? (
          <ArticleList
            items={items}
          />
        ) : null}
      </React.Fragment>
    )
  }
};

export default withAuthorisation(Articles);
