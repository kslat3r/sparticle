import { observable, makeObservable, action, runInAction } from 'mobx';
import makeRequest from '../helpers/makeRequest';

class AuthorisationStore {
  @observable token = null
  @observable requesting = false
  @observable error = false

  constructor () {
    makeObservable(this);
  }

  @action async fetch () {
    let token = localStorage.getItem('token');

    if (token) {
      runInAction(() => {
        this.token = token;
      });

      return;
    }

    runInAction(() => {
      this.requesting = true;
      this.error = false;
    });

    let body;

    try {
      body = await makeRequest(`${process.env.REACT_APP_API_HOST}/authorize`, { method: 'POST' });
      token = body.token;
    } catch (e) {
      runInAction(() => {
        this.requesting = false;
        this.error = e.message;
      });

      return;
    }

    localStorage.setItem('token', token);

    runInAction(() => {
      this.token = token;
      this.requesting = false;
      this.error = false;
    });
  }
}

export default AuthorisationStore;
