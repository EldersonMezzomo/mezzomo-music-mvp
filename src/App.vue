<template>
  <div id="app">
    <MainBackground />
    <router-view />
  </div>
</template>




<script>
import MainBackground from '@/components/MainBackground.vue';

export default {
  components: {
    MainBackground
  }
};
</script>




<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Oxygen:wght@300;400;700&display=swap');

body {
  font-family: 'Nunito Sans', 'Oxygen', sans-serif;
}

#app {
  max-width: 1600px;
  margin: 0 auto;
  }
</style>