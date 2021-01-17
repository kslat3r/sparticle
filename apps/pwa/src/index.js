import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'mobx-react-router';
import { Provider } from 'mobx-react';
import { Router, Switch, Route, Redirect } from 'react-router';
import articlesStore from './stores/articles';
import authorisationStore from './stores/authorisation';
import mediaStore from './stores/media';
import routingStore from './stores/routing';
import Articles from './containers/Articles';
import CreateArticles from './containers/CreateArticles';
import './index.css';

const stores = {
  articlesStore,
  authorisationStore,
  mediaStore,
  routingStore
};

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, routingStore);

ReactDOM.render((
  <Provider {...stores}>
    <Router
      history={history}
    >
      <Switch>
        <Route
          path="/articles/create"
        >
          <CreateArticles />
        </Route>
        <Route
          path="/articles"
        >
          <Articles />
        </Route>
        <Route
          path="/"
        >
          <Redirect
            to="/articles"
          />
        </Route>
      </Switch>
    </Router>
  </Provider>
), document.getElementById('root'));
