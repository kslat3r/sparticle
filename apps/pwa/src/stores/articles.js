import { observable, makeObservable, action, runInAction } from 'mobx';
import makeRequest from '../helpers/makeRequest';
import { v4 as uuid } from 'uuid';

class ArticlesStore {
  @observable items = [];
  @observable requesting = false;
  @observable error = false;

  refreshTimeout = 5000;
  intervals = {};

  constructor () {
    makeObservable(this);
  }

  @action async fetch (token) {
    runInAction(() => {
      this.requesting = true;
      this.error = false;
    });

    let items;

    try {
      items = await makeRequest(`${process.env.REACT_APP_API_HOST}/articles`, {
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

    this.pollItemsForCompletion(token, items.filter(item =>
      item.pollyTaskStatus === 'UNKNOWN' ||
      item.pollyTaskStatus === 'SCHEDULED' ||
      item.pollyTaskStatus === 'INPROGRESS' ||
      (item.pollyTaskStatus === 'COMPLETED' && !item.s3ObjectAccessible)
    ));

    runInAction(() => {
      this.items = items;
      this.requesting = false;
      this.error = false;
    });
  }

  @action async create(token, urls) {
    runInAction(() => {
      this.requesting = true;
      this.error = false;
    });

    try {
      await Promise.all(urls.map(url => makeRequest(`${process.env.REACT_APP_API_HOST}/articles`, {
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

      throw e;
    }

    runInAction(() => {
      this.requesting = false;
      this.error = false;
    });
  }

  @action async delete(token, id) {
    runInAction(() => {
      this.error = false;
      this.items.find(item => item.id === id).deleted = true;
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

  pollItemsForCompletion (token, items) {
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
  }
}

export default new ArticlesStore()
