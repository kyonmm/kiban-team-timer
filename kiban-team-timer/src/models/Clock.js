//import * as axios from "axios"

export class Clock {
  constructor(ntpServers, baseTime, localMode) {
    this.ntpServers = ntpServers;
    this.baseTime = baseTime;
    this.secondHand = 0;
    this.id = Math.random();
    this.syncTimer = new Timer(() => this.sync(), 30 * 60 * 1000).start();
    this.secondTimer = new Timer(() => this.tick(), 1000).start();
    this.localMode = localMode;
  }

  static async createAsync(ntpServers) {
    try {
      const st = await Ntp.ntpNowAsync(ntpServers[0]); // TODO : random
      return new Clock(ntpServers, st, false);
    } catch (e) {
      return new Clock(ntpServers, new Date().getTime(), true);
    }
  }

  isLocalMode() { return this.localMode; }

  sync() {
    const crntNtpServer = this.ntpServers[0];
    Ntp.ntpNowAsync(crntNtpServer).then(st => {
      this.baseTime = st;
      this.secondHand = 0;
      this.isLocalMode = false;
    }).catch((e) => {});
  }

  tick() {
    this.secondHand++;
  }

  now() {
    return this.baseTime + this.secondHand * 1000;
  }
  
  dispose() {
    this.syncTimer.dispose();
    this.secondTimer.dispose();
  }
}

class Timer {
  constructor(proc, intervalMSec) {
    this.proc = proc;
    this.intervalMSec = intervalMSec;
  }

  start() {
    this.timerId = setInterval(() => this.proc(), this.intervalMSec);
    return this;
  }

  dispose() {
    clearInterval(this.timerId);
  }
}

const Ntp = {
  async ntpNowAsync(ntpServerUrl) {
    throw new Error();
    //return axios.get(ntpServerUrl).then(res => {
    //  return res.st * 1000;
    //});
  }
}
