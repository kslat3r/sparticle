import { observable, makeObservable, action } from 'mobx';

class AuthorisationStore {
  @observable token = null
  @observable requesting = false
  @observable error = false

  constructor () {
    makeObservable(this);
  }

  @action async fetch () {
    this.token = localStorage.getItem('token');

    if (this.token) {
      return;
    }

    this.requesting = true;
    this.error = false;

    let response;
    let body;
    let token;

    try {
      response = await fetch(`${process.env.REACT_APP_API_HOST}/authorize`, { method: 'POST' });
      body = await response.json();
      token = body.token;
    } catch (e) {
      this.requesting = false;
      this.error = e.message;

      return;
    }

    localStorage.setItem('token', token);

    this.token = token;
    this.requesting = false;
    this.error = false;
  }

  @action reset () {
    window.localStorage.removeItem('token');

    this.token = null;
    this.requesting = false;
    this.error = false;
  }
}

export default new AuthorisationStore()
