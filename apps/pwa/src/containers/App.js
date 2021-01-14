import React from 'react';
import { inject, observer } from 'mobx-react';
import LoadingFullPage from '../components/LoadingFullPage';;

@inject('authorisationStore')
@observer
class App extends React.Component {
  componentDidMount () {
    this.props.authorisationStore.fetch();
  }

  render () {
    const {
      token
    } = this.props.authorisationStore;

    console.log(token);

    return token === null ? (
      <LoadingFullPage />
    ) : (
      <React.Fragment />
    );
  }
}

export default App;
