import { observable, makeObservable, action, runInAction } from 'mobx';
import makeRequest from '../helpers/makeRequest';
import { v4 as uuid } from 'uuid';

class ArticlesStore {
  @observable items = [];
  @observable requesting = false;
  @observable error = false;

  constructor () {
    makeObservable(this);
  }

  @action async fetch (token) {
    runInAction(() => {
      this.requesting = true;
      this.error = false;
    });

    let body;

    try {
      body = await makeRequest(`${process.env.REACT_APP_API_HOST}/articles`, {
        method: 'GET',
        headers: {
          Authorization: token
        }
      });
    } catch (e) {
      runInAction(() => {
        this.requesting = false;
        this.error = e.message;
      });

      return;
    }

    runInAction(() => {
      this.items = body;
      this.requesting = false;
      this.error = false;
    });
  }

  @action async create(token, urls) {
    runInAction(() => {
      this.requesting = true;
      this.error = false;
    });

    let items;

    try {
      items = await Promise.all(urls.map(url => makeRequest(`${process.env.REACT_APP_API_HOST}/articles`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: uuid(),
          encodedUrl: btoa(url)
        })
      })));
    } catch (e) {
      runInAction(() => {
        this.requesting = false;
        this.error = e.message;
      });

      return;
    }

    runInAction(() => {
      this.items = items;
      this.requesting = false;
      this.error = false;
    });
  }

  @action async delete(token, id) {
    runInAction(() => {
      this.items = this.items.filter(item => item.id !== id);
      this.error = false;
    });

    try {
      await makeRequest(`${process.env.REACT_APP_API_HOST}/articles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token
        }
      });
    } catch (e) {
      runInAction(() => {
        this.error = e.message;
      });

      return;
    }

    runInAction(() => {
      this.error = false;
    });
  }
}

export default new ArticlesStore()
