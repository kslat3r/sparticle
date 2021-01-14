import { observable, action } from 'mobx';

class ArticlesStore {
  @observable articles = [];
  @observable requesting = false;
  @observable error = false;

  @action async fetch (token) {
    this.requesting = true;
    this.error = false;

    let response;
    let body;

    try {
      response = await fetch(`${process.env.REACT_APP_API_HOST}/articles`, {
        method: 'POST',
        headers: {
          Authorization: token
        }
      });

      body = await response.json();
    } catch (e) {
      this.requesting = false;
      this.error = e.message;

      return;
    }

    this.articles = body;
    this.requesting = false;
    this.error = false;
  }
}

export default new ArticlesStore()
