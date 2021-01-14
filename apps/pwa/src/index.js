import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import authorisationStore from './stores/authorisation'
import App from './containers/App'
import './index.css'

const stores = {
  authorisationStore
};

ReactDOM.render((
  <Provider {...stores}>
    <App />
  </Provider>
), document.getElementById('root'));
