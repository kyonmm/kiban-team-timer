<template>
  <div id="app">
    <input v-model="configFilePath"></input>
    <button v-on:click="loadConfig">読み込み</button>
    <table id="main-contents" v-if="loaded">
      <tr>
        <td class="key">現在</td>
        <td class="value">{{currentTime}}, 前回同期時刻{{syncTime}}<span class="warn">{{mode}}</span></td>
      </tr>
      <tr>
        <td class="key current-event">現在のイベント</td>
        <td class="value current-event">{{currentEventName}}(残り: {{restTime()}})</td>
      </tr>
      <tr>
        <td class="key next-event">次のイベント</td>
        <td class="value next-event">
          <schedule-record mute-mode="not-mute" :time="nextEventTime" :event-name="nextEventName"></schedule-record>
        </td>
      </tr>
      <tr>
        <td class="key" id="future-events">Future Events</td>
        <td class="value">
          <ol id="future-events-list">
            <li v-for="(ev, index) in futureEvents" :key='index'>
              <schedule-record mute-mode="not-mute" :time="ev.time" :event-name="ev.name"></schedule-record>
            </li>
          </ol>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import ScheduleRecord from "./components/ScheduleRecord.vue"
import {Config} from "./models/Config.js"
import {Clock} from "./models/Clock.js"

var clock;

export default {
  name: 'app',
  components: {
    ScheduleRecord
  },
  data: function() {
    return {
      configFilePath: '',

      config: {},
      nextEventIndex: 0,

      syncTime: null,
      mode: null,
      currentTime: null,
    }
  },
  computed: {
    loaded() {
      return Object.keys(this.config).length != 0;
    },
    allEvents() {
      return this.config.getAllEvents();
    },
    currentEventName() {
      const index = this.nextEventIndex == 0 ? this.allEvents.length - 1 : this.nextEventIndex - 1;
      const ev = this.allEvents[index];
      return ev.name;
    },
    nextEvent() {
      return this.allEvents[this.nextEventIndex];
    },
    nextEventTime() {
      return this.nextEvent.time;
    },
    nextEventName() {
      return this.nextEvent.name;
    },
    futureEvents() {
      const res = [];
      for (let i = this.nextEventIndex + 1; i < this.allEvents.length; i++) {
        res.push(this.allEvents[i]);
      }
      for (let i = 0; i < this.nextEventIndex; i++) {
        res.push(this.allEvents[i]);
      }
      return res;
    },
  },
  methods :{
    loadConfig(e) {
      console.log("click! config-file-path is " + this.configFilePath + ".");
      let path = this.configFilePath;
      if (!path.startsWith('http')) {
        this.config = new Config(require('./assets/default-config.json'));
        console.log('loaded config file from assets.');
        this.reload();
      } else {
        Config.loadAsync(path).then(c => {
          this.config = c;
          console.log('loaded config file.');
          this.reload();
        }).catch(e => {
          // TODO : error handling
        });
      }
    },
    reload() {
      if (!clock) {
        Clock.createAsync(this.config.getNtpServerUrls()).then(c => {
          clock = c;
          this.reload();
        });
        return;
      }

      clearInterval(this.intervalId);
      const now = new Date(clock.now());
      this.nextEventIndex = this.config.getNextEventIndex(now);
      this.intervalId = setInterval(() => {
        this.mode = clock.isLocalMode() ? '(システム時刻使用中)' : '';
        const now = clock.now();
        const nowDate = new Date(now);
        const nowText = nowDate.toLocaleTimeString();
        if (nowText != this.currentTime) {
          this.currentTime = nowText;
          this.syncTime = new Date(clock.prevSyncTime()).toLocaleTimeString();
        }
        for (let i = this.nextEventIndex; i < this.allEvents.length; i++) {
          const ev = this.allEvents[i];
          if (ev.isAfterThan(nowDate)) {
            this.notify(ev.name);
            this.nextEventIndex = i + 1;
            if (this.nextEventIndex == this.allEvents.length) {
              this.nextEventIndex = 0;
            }
          }
        }
      }, 100);
    },
    notify(eventName) {
      const fileName = this.config.getMusic(eventName)
      new Audio(require("./assets/"+ fileName)).play().catch(e => {
        console.log("error Audio.play: " + e);
      });
      console.log(fileName)
    },
    restTime() {
      if (!clock) {
        return "";
      }
      const now = new Date(clock.now());
      const diff = this.nextEvent.diffInMillis(now);
      const restMin = Math.floor(diff / 60000);
      if (restMin != 0) {
        return restMin + '分';
      }
      return Math.ceil(diff / 1000) + '秒';
    },
  },
  beforeDestroy() {
    console.log("before destroy");
    if (clock) {
      clock.dispose();
    }
    clearInterval(this.intervalId);
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#main-contents {
  margin-right: auto;
  margin-left: auto;
  width: 800px;
  border: solid 1px black;
}
#future-events-list {
  list-style-type: none;
  padding: 0px;
  margin: 0px;
}
#future-events {
  vertical-align: baseline;
}
.key {
  border: solid 1px black;
  text-align: left;
  padding: 5px;
}
.value {
  border: solid 1px black;
  text-align: left;
  padding: 5px;
}
.next-event {
  font-size: 200%;
}
.warn {
  font-color: red;
}

</style>
