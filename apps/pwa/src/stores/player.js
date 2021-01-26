import { makeObservable, action } from 'mobx';

class PlayerStore {
  currentlyPlayingId = null;
  currentlyPlaying = null;
  medias = [];

  constructor () {
    makeObservable(this);
  }

  @action onReady (id, media, created) {
    const duration = localStorage.getItem(`${id}-duration`);

    if (duration) {
      media.seekTo(duration);
    }

    this.addMedia({ id, media, created });
  }

  addMedia (toAdd) {
    this.medias.push(toAdd);
    this.medias = this.medias.sort((a, b) => b.created - a.created);
  }

  @action onReset (id, media) {
    media.seekTo(0);

    this.onTimeUpdate(id, 0);
  }

  @action onClick (id, media) {
    if (id !== this.currentlyPlayingId && this.currentlyPlaying) {
      this.currentlyPlaying.pause();
    }

    media.playPause();

    this.currentlyPlayingId = id;
    this.currentlyPlaying = media;
  }

  @action onTimeUpdate (id, currentTime, totalTime) {
    localStorage.setItem(`${id}-duration`, currentTime);

    if (currentTime === totalTime) {
      const index = this.medias.findIndex(obj => obj.id === id);
      const next = this.medias[index + 1];

      if (next) {
        this.reset();
        this.onClick(next.id, next.media);
      }
    }
  }

  @action reset () {
    this.currentlyPlayingId = null;
    this.currentlyPlaying = null;
  }
}

export default new PlayerStore()
