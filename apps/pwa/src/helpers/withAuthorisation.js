import React from 'react';
import { inject, observer } from 'mobx-react';
import LoadingDialog from '../components/Dialog/Loading';
import ErrorDialog from '../components/Dialog/Error';

const withAuthorization = OriginalComponent => {
  @inject('authorisationStore')
  @observer
  class AuthorisedComponent extends React.Component {
    componentDidMount () {
      this.props.authorisationStore.fetch();
    }

    render () {
      const {
        authorisationStore: {
          requesting,
          error,
          token
        },
        ...childProps
      } = this.props

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
            <OriginalComponent
              {...childProps}
            />
          ) : null}
        </React.Fragment>
      )
    }
  }

  return AuthorisedComponent
}

export default withAuthorization;
