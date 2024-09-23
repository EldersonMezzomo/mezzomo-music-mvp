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
/* Adicione aqui os estilos globais */
</style>
