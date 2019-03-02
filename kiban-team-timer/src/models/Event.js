export class Event {
  constructor(time, name, music) {
    this.time = time;
    this.name = name;
    this.music = music;
  }

  diffInMillis(now) {
    const nowInMillis = now.getTime();
    const eventTime = new Date(nowInMillis);
    const splitted = this.time.split(':');
    const hours = Number.parseInt(splitted[0]);
    const minutes = Number.parseInt(splitted[1]);
    if (now.getHours() == 23 && hours < 22) {
      return false;
    }
    eventTime.setHours(hours);
    eventTime.setMinutes(minutes);
    eventTime.setSeconds(0);
    eventTime.setMilliseconds(0);
    return eventTime.getTime() - nowInMillis;
  }

  isAfterThan(now) {
    return this.diffInMillis(now) < 0;
  }
}
