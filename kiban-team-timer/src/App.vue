<template>
  <div id="app">
    Hoge
    <button v-on:click="doHello">Hello!!!</button>
    <Config ref="config"></Config>
  </div>
</template>

<script>
import {SomeModel} from './models/SomeModel.js'
import Config from "./components/Config.vue"
var timer = null;
export default {
  name: 'app',
  components: {
    Config
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
    notify() {
      const soundName = this.$refs.config.content
      new Audio(require("./assets/"+soundName)).play();
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
</style>
