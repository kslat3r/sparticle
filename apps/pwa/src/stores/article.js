import { observable, makeObservable, action, runInAction } from 'mobx';
import makeRequest from '../helpers/makeRequest';
import makeThrottledRequest from '../helpers/makeThrottledRequest';
import { v4 as uuid } from 'uuid';

class ArticleStore {
  authorisationStore = null;

  @observable items = [];
  @observable requesting = false;
  @observable error = false;

  @observable isPlayerShown = false;
  @observable isPlaying = false;
  @observable selected = null;

  refreshTimeout = 5000;
  intervals = {};

  constructor (authorisationStore) {
    makeObservable(this);

    this.authorisationStore = authorisationStore;
  }

  @action async fetch (type) {
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
          Authorization: this.authorisationStore.token
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
    ));

    runInAction(() => {
      this.items = items;
      this.requesting = false;
      this.error = false;
    });
  }

  poll (items) {
    items.forEach(item => {
      const interval = setInterval(async () => {
        // make request

        let article;

        try {
          article = await makeRequest(`${process.env.REACT_APP_API_HOST}/articles/${item.id}`, {
            method: 'GET',
            headers: {
              Authorization: this.authorisationStore.token
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

  @action playPause (item) {
    runInAction(() => {
      this.isPlayerShown = true;

      if (this.selected && this.selected.id === item.id) {
        this.isPlaying = !this.isPlaying;
      } else {
        this.isPlaying = true;
      }

      this.selected = item;

      if (this.selected.s3ObjectElapsed === this.selected.s3ObjectDuration) {
        this.seek(this.selected, 0);
      }
    });
  }

  @action async seek (item, time) {
    runInAction(() => {
      this.error = false;
      item.s3ObjectElapsed = time;
    });

    try {
      await makeThrottledRequest(`${process.env.REACT_APP_API_HOST}/articles/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          s3ObjectElapsed: time
        }),
        headers: {
          Authorization: this.authorisationStore.token
        }
      }, 10000);
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

  @action stop (item) {
    runInAction(() => {
      this.isPlaying = false;

      const getNext = index => {
        const nextIndex = index + 1;

        if (nextIndex < this.items.length) {
          const nextItem = this.items[nextIndex];

          if (nextItem && nextItem.s3ObjectElapsed < nextItem.s3ObjectDuration) {
            return nextItem;
          }

          return getNext(nextIndex);
        }
      }

      const currentIndex = this.items.findIndex(it => it.id === item.id);
      const nextItem = getNext(currentIndex);

      if (nextItem) {
        this.playPause(nextItem);
      }
    });
  }

  @action async favourite (item, isFavourite) {
    runInAction(() => {
      this.error = false;
      item.favourite = isFavourite;
    });

    try {
      await makeRequest(`${process.env.REACT_APP_API_HOST}/articles/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          favourite: isFavourite
        }),
        headers: {
          Authorization: this.authorisationStore.token
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

  @action async delete (item) {
    runInAction(() => {
      this.error = false;
      this.items.find(it => it.id === item.id).deleted = true;
    });

    try {
      await makeRequest(`${process.env.REACT_APP_API_HOST}/articles/${item.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: this.authorisationStore.token
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

  @action async create (data) {
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
          voice: d.voice,
          speed: d.speed
        }),
        headers: {
          Authorization: this.authorisationStore.token,
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

export default ArticleStore;
