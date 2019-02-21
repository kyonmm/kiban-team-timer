<template>
  <div id="app">
    Hoge
    <button v-on:click="doHello">Hello!!!</button>
    <Config ref="config"></Config>

    <dl>
    <dt>現在</dt><dd>{{currentTime}}</dd>
    <dt>次のイベント</dt><dd>{{nextEvent}}</dd>
    <dt>Future Events</dt>
    <dd>
      <ol v-for="ev in futureEvents">
        <li>{{ev.time}} : {{ev.eventName}}</li>
      </ol>
    </dd>
    </dl>
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
}
</style>
