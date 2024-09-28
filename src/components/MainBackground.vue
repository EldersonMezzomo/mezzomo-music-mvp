<!-- MainBackground.vue -->
<template>
  <div class="background">
    <div class="blurred-spots" v-for="n in 5" :key="n"></div>
  </div>
</template>




<script>
export default {
  name: 'MainBackground',
};
</script>




<style scoped>
@import "@/assets/css/variables.css";

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-dark);
  overflow: hidden;
  z-index: -1;
}

.blurred-spots {
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(var(--color-primary-rgb), 0.15);
  border-radius: 50%;
  filter: blur(150px);
  animation: move-spots 9s infinite alternate ease-in-out;
}

/* Posicionando as manchas em diferentes locais da tela */
.blurred-spots:nth-child(1) {
  top: 20%;
  left: 15%;
}

.blurred-spots:nth-child(2) {
  top: 60%;
  left: 25%;
}

.blurred-spots:nth-child(3) {
  top: 40%;
  right: 20%;
}

.blurred-spots:nth-child(4) {
  bottom: 15%;
  left: 50%;
}

.blurred-spots:nth-child(5) {
  bottom: 25%;
  right: 10%;
}

/* Animação para movimentar as manchas lentamente */
@keyframes move-spots {
  0% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(50px, -50px);
  }

  100% {
    transform: translate(-50px, 50px);
  }
}
</style>