import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar as MUToolbar } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
  toolbar: {
    paddingRight: theme.spacing(1),
  }
});

@inject('articleStore')
@inject('routingStore')
@observer
class Toolbar extends React.Component {
  constructor (props) {
    super(props);

    this.onBackClick = this.onBackClick.bind(this);
    this.onAddArticlesClick = this.onAddArticlesClick.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
  }

  componentDidMount() {
    const {
      showTabs
    } = this.props;

    if (showTabs) {
      document.body.classList.add('has-tabs');
    } else {
      document.body.classList.remove('has-tabs');
    }
  }

  onBackClick (e) {
    e.preventDefault();

    const {
      routingStore
    } = this.props;

    routingStore.goBack();
  }

  onAddArticlesClick (e) {
    e.preventDefault();

    const {
      routingStore
    } = this.props;

    routingStore.push('/articles/create');
  }

  onTabClick (e, type) {
    e.preventDefault();

    const {
      routingStore,
      articleStore
    } = this.props;

    routingStore.push(`/articles/${type}`);
    articleStore.fetch(type);
  }

  render () {
    const {
      classes,
      showBack,
      showFeedback,
      showAddArticles,
      showTabs,
      type
    } = this.props

    return (
      <AppBar
        position="fixed"
      >
        <MUToolbar
          className={classes.toolbar}
        >
          {showBack ? (
            <IconButton
              edge="start"
              className={classes.backButton}
              onClick={this.onBackClick}
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

          {showFeedback ? (
            <Button
              color="inherit"
              data-az-l="edf0bd0c-b36f-4822-b579-43e29f372f9f"
            >
              Give feedback
            </Button>
          ) : null}

          {showAddArticles ? (
            <Button
              color="inherit"
              onClick={this.onAddArticlesClick}
            >
              Add articles
            </Button>
          ) : null}
        </MUToolbar>

        {showTabs ? (
          <Paper
            square
            className={classes.root}
          >
            <Tabs
              variant="fullWidth"
              onChange={this.onTabClick}
              value={type}
              indicatorColor="secondary"
              textColor="secondary"
            >
              <Tab
                label="Recent"
                value="recent"
              />

              <Tab
                label="Favourites"
                value="favourites"
              />

              <Tab
                label="Archived"
                value="archived"
              />
            </Tabs>
          </Paper>
         ) : null}
      </AppBar>
    );
  }
}

Toolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  showBack: PropTypes.bool.isRequired,
  showFeedback: PropTypes.bool.isRequired,
  showAddArticles: PropTypes.bool.isRequired,
  showTabs: PropTypes.bool.isRequired,
  type: PropTypes.string
};

export default withStyles(styles)(Toolbar);
