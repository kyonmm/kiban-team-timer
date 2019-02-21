<template>
  <div id="app">
    Hoge
    <button v-on:click="doHello">Hello!!!</button>
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import {SomeModel} from './models/SomeModel.js'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  methods :{
    doHello() {
      alert(new SomeModel().hello())
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
