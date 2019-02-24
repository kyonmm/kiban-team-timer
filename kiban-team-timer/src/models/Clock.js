import * as axios from "axios"

export class Clock {
  constructor(ntpServers, baseTime, localMode) {
    this.ntpServers = ntpServers;
    this.baseTime = baseTime;
    this.startTime = performance.now();
    this.id = Math.random();
    this.syncTimer = new Timer(() => this.sync(), 30 * 60 * 1000).start();
    this.localMode = localMode;
    if (!localMode) {
      this.syncTime = baseTime;
    }
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
      this.startTime = performance.now();
      this.localMode = false;
      this.syncTime = this.now();
    }).catch((e) => {});
  }

  prevSyncTime() {
    return this.syncTime;
  }

  now() {
    const diff = performance.now() - this.startTime;
    return this.baseTime + diff;
  }
  
  dispose() {
    this.syncTimer.dispose();
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
    return axios.get(ntpServerUrl).then(res => {
      return res.data.st * 1000;
    });
  }
}
