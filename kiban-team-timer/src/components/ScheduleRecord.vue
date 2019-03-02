<template>
  <span :class="muteMode">
    <span class="scheduled-time">{{time}}</span>, 
    <span class="scheduled-event-name">{{eventName}}</span>
  </span>
</template>

<script>
export default{
  name: "schedule-record",
  props: [
    'muteMode',
    'time',
    'eventName',
  ],
}
</script>

<style>
.mute {
  color: gray;
}
</style>
