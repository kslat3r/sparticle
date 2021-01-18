import { makeObservable, action } from 'mobx';

class MediaStore {
  currentlyPlayingId = null;
  currentlyPlaying = null;

  constructor () {
    makeObservable(this);
  }

  @action onReady (id, media) {
    const duration = localStorage.getItem(`${id}-duration`);

    if (duration) {
      media.seekTo(duration);
    }
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

  @action onTimeUpdate (id, duration) {
    localStorage.setItem(`${id}-duration`, duration);
  }
}

export default new MediaStore()
