import React from 'react';
import { inject, observer } from 'mobx-react';
import LoadingDialog from '../components/LoadingDialog';
import ErrorDialog from '../components/ErrorDialog';

const withAuthorization = OriginalComponent => {
  @inject('authorisationStore')
  @observer
  class AuthorisedComponent extends React.Component {
    componentDidMount () {
      this.props.authorisationStore.fetch();
    }

    render () {
      const {
        requesting,
        error,
        token
      } = this.props.authorisationStore;

      return (
        <React.Fragment>
          {requesting ? (
            <LoadingDialog />
          ) : null}

          {error ? (
            <ErrorDialog
              message={error}
            />
          ) : null}

          {!requesting && !error && token ? (
            <OriginalComponent />
          ) : null}
        </React.Fragment>
      )
    }
  }

  return AuthorisedComponent
}

export default withAuthorization;
