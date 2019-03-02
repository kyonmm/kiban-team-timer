import {Event} from './Event.js'
import * as axios from 'axios'

export class Config {
  constructor(configObj) {
    this.config = configObj;
  }

  static async loadAsync(configUrl) {
    const config = await axios.get(configUrl);
    return new Config(config);
  }

  getAllEvents() {
    const events = new Array(this.config.schedule.length);
    for (let i = 0; i < events.length; i++) {
      let s = this.config.schedule[i];
      let ev = s['event-name'];
      events[i] = new Event(s.time, ev, this.config.music[ev]);
    }
    return events;
  }

  getNextEventIndex(now) {
    const nowNum = now.getHours() * 100 + now.getMinutes();
    return this.config.schedule.findIndex(s => {
      const t = Number.parseInt(s.time.replace(':', ''));
      return t > nowNum;
    });
  }

  getMusic(eventName) {
    return this.config.music[eventName];
  }

  getNtpServerUrls() {
    return this.config['ntp-server-urls'];
  }
}
