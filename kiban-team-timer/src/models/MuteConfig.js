import * as axios from 'axios'

export class MuteConfig {
  constructor(muteEnd) {
    this.muteEnd = muteEnd;
  }

  static async loadAsync(configUrl) {
    const config = await axios.get(configUrl);
    return new MuteConfig(parseDateTime(config.data));
  }
}

const dateTimeRegex =
  /^(\d{4})[-\/]?(\d{1,2})[-\/]?(\d{1,2})[ T]?(\d{1,2})[:]?(\d{1,2})[:]?(\d{1,2})([-+]\d{1,2}[:]?\d{1,2})$/g;

function parseDateTime(str) {
  const res = dateTimeRegex.exec(str);
  const year = Number.parseInt(res[1]);
  const month = Number.parseInt(res[2]);
  const day = Number.parseInt(res[3]);
  const hour = Number.parseInt(res[4]);
  const minute = Number.parseInt(res[5]);
  const second = Number.parseInt(res[6]);
  const offset = parseOffset(res[7]);
  const d = new Date(0);
  d.setYear(year);
  d.setMonth(month);
  d.setDate(day);
  d.setHours(hour);
  d.setMinutes(minute);
  d.setSeconds(second);
  return new Date(d.getTime() + offset);
}

function parseOffset(str) {
  const isPlus = str[0] == '+';
  const hasColon = str.indexOf(':') != -1;
  const hour = Number.parseInt(str.substring(1, 3));
  const minute = Number.parseInt(str.substring(hasColon ? 4 : 3));
  const mins = (60 * hour + minute) * 60 * 1000;
  return isPlus ? mins : -mins;
}
