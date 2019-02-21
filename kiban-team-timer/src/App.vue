<template>
  <div id="app">
    Hoge
    <button v-on:click="doHello">Hello!!!</button>
    <Config ref="config"></Config>

    <table id="main-contents">
      <tr><td class="key">現在</td><td class="value">{{currentTime}}</td></tr>
      <tr><td class="key">次のイベント</td><td class="value">{{nextEvent}}</td></tr>
      <tr><td class="key">Future Events</td>
      <td class="value">
        <ol id="future-events-list">
          <li v-for="ev in futureEvents">{{ev.time}} : {{ev.eventName}}</li>
        </ol>
      </td></tr>
    </table>
  </div>
</template>

<script>
import {SomeModel} from './models/SomeModel.js'
import Config from "./components/Config.vue"
import {Schedule} from "./models/Schedule.js"
var timer = null;

export default {
  name: 'app',
  components: {
    Config
  },
  data: function() {
    return {
      currentTime: "sample",
      nextEvent: "sample2",
      futureEvents: [
        { time: "aaa", eventName: "bbb" }, 
        { time: "ccc", eventName: "ddd" }, 
      ]
    }
  },
  methods :{
    doHello() {
      if(timer != null){
        clearInterval(timer);
        timer = null;
        return;
      }
      timer = setInterval(this.notify,10000);

    },
    notify(eventName) {
      const soundName = this.$refs.config.content
      const fileName = new Schedule().getMusic(eventName)
      new Audio(require("./assets/"+ fileName)).play();
      console.log(fileName)
    }

  },
  mounted() {
    console.log("mounted");
    let schedule = new Schedule();
    const now = new Date();
    let events = schedule.getNextEvents(now.getHours(), now.getMinutes());
    events.map( x => {
      const eventTime = new Date()
      const splitted = x.time.split(':')
      eventTime.setHours(Number.parseInt(splitted[0]))
      eventTime.setMinutes(Number.parseInt(splitted[1]))
      eventTime.setSeconds(0)
      const diff = eventTime.getTime() - now.getTime()
console.log(diff)
      setTimeout(() => this.notify(x["event-name"]), diff)
    })
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
  width: 800px;
}
#main-contents {
  width: 600px;
  border: solid 1px black;
}
#future-events-list {
  list-style-type: none;
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

</style>
