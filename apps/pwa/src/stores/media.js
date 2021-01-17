import { observable, makeObservable, action } from 'mobx';

class MediaStore {
  @observable players = {}
  @observable currentlyPlayingId = null;

  constructor () {
    makeObservable(this);
  }

  @action add (id, player) {
    this.players[id] = player;
  }

  @action onReady (id) {
    const duration = localStorage.getItem(`${id}-duration`);

    if (duration) {
      this.players[id].seekTo(duration);
    }
  }

  @action onReset (id) {
    this.players[id].seekTo(0);
    this.onTimeUpdate(id, 0);
  }

  @action onPlayPause (id) {
    if (id === this.currentlyPlayingId) {
      this.players[id].playPause();

      return;
    }

    Object.keys(this.players).forEach(id => this.players[id].pause());

    this.players[id].play();
    this.currentlyPlayingId = id;
  }

  @action onTimeUpdate (id, duration) {
    localStorage.setItem(`${id}-duration`, duration);
  }
}

export default new MediaStore()
