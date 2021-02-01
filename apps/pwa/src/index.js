import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'mobx-react-router';
import { Provider } from 'mobx-react';
import { Router, Switch, Route, Redirect } from 'react-router';
import articleStore from './stores/article';
import authorisationStore from './stores/authorisation';
import routingStore from './stores/routing';
import Player from './components/Player';
import Articles from './components/Articles';
import CreateArticles from './components/CreateArticles';
import './index.css';

const stores = {
  articleStore,
  authorisationStore,
  routingStore
};

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, routingStore);

ReactDOM.render((
  <Provider {...stores}>
    <Player>
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
            path="/articles/recent"
          >
            <Articles
              type="recent"
              showDeleted={false}
            />
          </Route>
          <Route
            path="/articles/favourites"
          >
            <Articles
              type="favourites"
              showDeleted={false}
            />
          </Route>
          <Route
            path="/articles/archived"
          >
            <Articles
              type="archived"
              showDeleted={true}
            />
          </Route>
          <Route
            path="/"
          >
            <Redirect
              to="/articles/recent"
            />
          </Route>
        </Switch>
      </Router>
    </Player>
  </Provider>
), document.getElementById('root'));
