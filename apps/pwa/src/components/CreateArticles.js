import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import withAuthorisation from '../helpers/withAuthorisation';
import Toolbar from './Toolbar';
import LoadingDialog from './Dialog/Loading';
import ErrorDialog from './Dialog/Error';
import CreateArticleForm from './Form/CreateArticle';

const styles = theme => ({
  button: {
    marginRight: theme.spacing(2),
    float: 'right',
    position: 'relative',
    display: 'block'
  },
  buttons: {
    minHeight: 64
  }
});

@inject('articleStore')
@inject('routingStore')
@observer
class CreateArticles extends React.Component {
  constructor (props) {
    super(props);

    this.onArticleCreationFormChange = this.onArticleCreationFormChange.bind(this);
    this.onNewArticleFormButtonClick = this.onNewArticleFormButtonClick.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);

    this.state = {
      count: 1,
      data: []
    };
  }

  onArticleCreationFormChange (key, formData) {
    const data = this.state.data;

    data[key] = formData;

    this.setState({
      data
    });
  }

  onNewArticleFormButtonClick (e) {
    e.preventDefault();

    this.setState({
      count: this.state.count + 1
    });
  }

  async onSubmitClick (e) {
    e.preventDefault();

    if (this.state.data.length) {
      const {
        data
      } = this.state;

      const {
        articleStore,
        routingStore
      } = this.props

      try {
        await articleStore.create(data);
        routingStore.push('/articles');
      } catch (e) {}
    }
  }

  render () {
    const {
      classes,
      articleStore: {
        requesting,
        error
      }
    } = this.props;

    const {
      count
    } = this.state;

    const forms = [];

    for (let i = 0; i < count; i++) {
      forms.push((
        <CreateArticleForm
          key={i}
          index={i}
          onChange={this.onArticleCreationFormChange}
        />
      ))
    }

    return (
      <React.Fragment>
        <Toolbar
          showBack={true}
          showFeedback={true}
          showAddArticles={false}
          showTabs={false}
        />

        {requesting ? (
          <LoadingDialog />
        ) : null}

        {error ? (
          <ErrorDialog
            message={error}
          />
        ) : null}

        <React.Fragment>
          {forms}

          <div
            className={classes.buttons}
          >
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={this.onSubmitClick}
              size="large"
            >
              Let's go!
            </Button>

            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              onClick={this.onNewArticleFormButtonClick}
              size="large"
            >
              Add another URL
            </Button>
          </div>
        </React.Fragment>
      </React.Fragment>
    )
  }
};

CreateArticles.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withAuthorisation(withStyles(styles)(CreateArticles));
