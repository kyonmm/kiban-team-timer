<template>
  <div id="app">
    <table id="main-contents">
      <tr><td class="key">現在</td><td class="value">{{currentTime}}</td></tr>
      <tr><td class="key next-event">次のイベント</td><td class="value next-event">{{events[nextEventIndex].time}} : {{events[nextEventIndex]["event-name"]}}</td></tr>
      <tr><td class="key" id="future-events">Future Events</td>
      <td class="value">
        <ol id="future-events-list">
          <li v-for="ev in futureEvents()">{{ev.time}} : {{ev["event-name"]}}</li>
        </ol>
      </td></tr>
    </table>
  </div>
</template>

<script>
import {Schedule} from "./models/Schedule.js"
import {Clock} from "./models/Clock.js"

var clock;

export default {
  name: 'app',
  components: {
  },
  data: function() {
    return {
      currentTime: null,
      nextEventIndex: 0,
      events: [{}],
    }
  },
  methods :{
    futureEvents() {
      const res = [];
      for (let i = this.nextEventIndex + 1; i < this.events.length; i++) {
        res.push(this.events[i]);
      }
      for (let i = 0; i < this.nextEventIndex; i++) {
        res.push(this.events[i]);
      }
      return res;
    },
    notify(eventName) {
      const fileName = new Schedule().getMusic(eventName)
      new Audio(require("./assets/"+ fileName)).play();
      console.log(fileName)
    }
  },
  created() {
    const schedule = new Schedule();
    this.events = schedule.getAllEvents();
    Clock.createAsync(['']).then(c => {
      clock = c;
      const now = new Date(clock.now());
      this.nextEventIndex = schedule.getNextEventIndex(now);
      setInterval(() => {
        const now = clock.now();
        const nowDate = new Date(now);
        const nowText = nowDate.toLocaleTimeString();
        if (nowText != this.currentTime) {
          this.currentTime = nowText;
        }
        for (let i = this.nextEventIndex; i < this.events.length; i++) {
          const x = this.events[i];
          const eventTime = new Date(now);
          const splitted = x.time.split(':');
          eventTime.setHours(Number.parseInt(splitted[0]));
          eventTime.setMinutes(Number.parseInt(splitted[1]));
          eventTime.setSeconds(0);
          eventTime.setMilliseconds(0);
          const diff = eventTime.getTime() - now;
          if (diff < 0) {
            console.log(diff);
            this.notify(x["event-name"]);
            this.nextEventIndex = i + 1;
          }
        }
      }, 100);
    });
  },
  beforeDestroy() {
    console.log("before destroy");
    if (clock) {
      clock.dispose();
    }
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

</style>
