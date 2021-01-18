import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import Toolbar from '../components/Toolbar';
import LoadingDialog from '../components/LoadingDialog';
import ErrorDialog from '../components/ErrorDialog';
import CreateArticleForm from '../components/CreateArticleForm';
import Button from '@material-ui/core/Button';
import withAuthorisation from '../helpers/withAuthorisation';

const styles = theme => ({
  button: {
    marginRight: theme.spacing(2),
    float: 'right'
  }
});

@inject('articlesStore')
@inject('authorisationStore')
@inject('routingStore')
@observer
class CreateArticles extends React.Component {
  constructor (props) {
    super(props);

    this.onBackClick = this.onBackClick.bind(this);
    this.onArticleCreationFormBlur = this.onArticleCreationFormBlur.bind(this);
    this.onNewArticleFormButtonClick = this.onNewArticleFormButtonClick.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);

    this.state = {
      count: 1,
      urls: []
    };
  }

  onBackClick (e) {
    e.preventDefault();

    this.props.routingStore.push('/articles');
  }

  onArticleCreationFormBlur (key, value) {
    const urls = this.state.urls;

    urls[key] = value;

    this.setState({
      urls
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

    if (this.state.urls.length) {
      try {
        await this.props.articlesStore.create(this.props.authorisationStore.token, this.state.urls);

        this.props.routingStore.push('/articles');
      } catch (e) {}
    }
  }

  render () {
    const {
      classes,
      articlesStore: {
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
          onBlur={this.onArticleCreationFormBlur}
        />
      ))
    }

    return (
      <React.Fragment>
        <Toolbar
          onBackClick={this.onBackClick}
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

          <div>
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
