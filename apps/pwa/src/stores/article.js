import { observable, makeObservable, action, runInAction } from 'mobx';
import makeRequest from '../helpers/makeRequest';
import { v4 as uuid } from 'uuid';

class ArticleStore {
  @observable items = [];
  @observable requesting = false;
  @observable error = false;

  refreshTimeout = 5000;
  intervals = {};

  constructor () {
    makeObservable(this);
  }

  @action async fetch (type, token) {
    runInAction(() => {
      this.requesting = true;
      this.error = false;
    });

    let items;

    try {
      let url = `${process.env.REACT_APP_API_HOST}/articles`;

      if (type !== 'recent') {
        url = `${url}/${type}`;
      }

      items = await makeRequest(url, {
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

    // poll updated to scheduled polly tasks

    this.poll(items.filter(item =>
      item.pollyTaskStatus === 'UNKNOWN' ||
      item.pollyTaskStatus === 'SCHEDULED' ||
      item.pollyTaskStatus === 'INPROGRESS' ||
      (item.pollyTaskStatus === 'COMPLETED' && !item.s3ObjectAccessible)
    ), token);

    runInAction(() => {
      this.items = items;
      this.requesting = false;
      this.error = false;
    });
  }

  poll (items, token) {
    items.forEach(item => {
      const interval = setInterval(async () => {
        // make request

        let article;

        try {
          article = await makeRequest(`${process.env.REACT_APP_API_HOST}/articles/${item.id}`, {
            method: 'GET',
            headers: {
              Authorization: token
            }
          });
        } catch (e) {}

        // has the article completed?

        if ((article.pollyTaskStatus === 'COMPLETED' && article.s3ObjectAccessible) || article.pollyTaskStatus === 'FAILED') {
          // clear interval

          clearInterval(this.intervals[item.id]);

          // remove interval from array

          delete this.intervals[item.id];

          // update article in list

          runInAction(() => {
            this.items.splice(this.items.findIndex(item => item.id === article.id), 1, article);
          });
        }
      }, this.refreshTimeout);

      this.intervals[item.id] = interval;
    })
  };

  @action async play (item) {

  }

  @action async reset (item) {

  }

  @action async favourite (item, token, isFavourite) {
    runInAction(() => {
      this.error = false;
      this.items.find(it => it.id === item.id).favourite = isFavourite;
    });

    try {
      await makeRequest(`${process.env.REACT_APP_API_HOST}/articles/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          favourite: isFavourite
        }),
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

  @action async delete (item, token) {
    runInAction(() => {
      this.error = false;
      this.items.find(it => it.id === item.id).deleted = true;
    });

    try {
      await makeRequest(`${process.env.REACT_APP_API_HOST}/articles/${item.id}`, {
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

  @action async create (data, token) {
    runInAction(() => {
      this.requesting = true;
      this.error = false;
    });

    try {
      await Promise.all(data.map(d => makeRequest(`${process.env.REACT_APP_API_HOST}/articles`, {
        method: 'POST',
        body: JSON.stringify({
          id: uuid(),
          encodedUrl: btoa(d.url),
          voice: d.voice
        }),
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      })));
    } catch (e) {
      runInAction(() => {
        this.requesting = false;
        this.error = e.message;
      });

      throw e;
    }

    runInAction(() => {
      this.requesting = false;
      this.error = false;
    });
  }
}

export default new ArticleStore()
