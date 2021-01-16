import React from 'react';
import { inject } from 'mobx-react';

@inject('authorisationStore')
class Authentication extends React.Component {
  componentDidMount () {
    this.props.authorisationStore.fetch(this.props.authorisationStore.token);
  }

  render () {
    const {
      children
    } = this.props;

    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    )
  }
};

export default Authentication;
