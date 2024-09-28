<!-- MainCarrossel.vue -->
<template>
  <div class="carrossel-container">
    <div class="carrossel-header">
      <h2>{{ titulo }}</h2>
      <div class="arrows">

        <button class="arrow left" @click="scrollLeft">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button class="arrow right" @click="scrollRight">
          <i class="fa-solid fa-chevron-right"></i>
        </button>

      </div>
    </div>

    <div class="carousel" ref="carousel">
      <div v-for="item in items" :key="item.id" class="item" @click="abrirItem(item)">
        <img :src="item.capa" :alt="item.nome" class="capa-img" />
        <p>{{ item.nome }}</p>
      </div>
    </div>
  </div>
</template>




<script>
export default {
  props: {
    items: { type: Array, required: true },
    titulo: { type: String, default: "" }
  },
  methods: {
    abrirItem(item) {
      this.$emit("itemSelecionado", item);
    },
    // Função para rolar o carrossel para a esquerda
    scrollLeft() {
      this.$refs.carousel.scrollBy({
        left: -200,
        behavior: "smooth"
      });
    },
    // Função para rolar o carrossel para a direita
    scrollRight() {
      this.$refs.carousel.scrollBy({
        left: 200,
        behavior: "smooth"
      });
    }
  }
};
</script>




<style scoped>
@import "@/assets/css/variables.css";

.carrossel-container {
  margin: calc(var(--padding-default) * 0.75); /* 30px */
  background-color: rgba(var(--color-dark-rgb), 0.4);
  border-radius: 10px;
  position: relative;
}

.carrossel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(var(--padding-default) * 0.375); /* 15px */
}

.carrossel-container h2 {
  font-family: var(--font-oxygen);
  font-size: var(--size-xlarge-2);
  color: var(--color-secondary);
}

.arrows {
  display: flex;
  gap: 10px;
}

.arrow {
  background: none;
  border: none;
  color: var(--color-secondary);
  font-size: var(--size-xlarge-2);
  cursor: pointer;
  padding: 5px;
}

.arrow:hover {
  color: var(--color-primary);
}

.carousel {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.carousel::-webkit-scrollbar {
  display: none;
}

.item {
  flex: 0 0 auto;
  width: 160px;
  padding: calc(var(--padding-default) * 0.375); /* 15px */
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s ease;
}

.item:hover {
  background-color: rgba(var(--color-secondary-rgb), 0.09);
  border-radius: 10px;
}

.capa-img {
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.item p {
  font-family: var(--font-nunito-sans);
  font-size: var(--size-large-1);
  color: var(--color-secondary);
  margin-top: calc(var(--padding-default) * 0.125); /* 5px */
  transition: color 0.3s ease;
}

.item:hover p {
  color: var(--color-primary);
}




/* Tablet */
@media (max-width: 768px) {

  .carousel .item {
    width: 120px;
  }
}




/* Mobile */
@media (max-width: 480px) {
  
  .arrows {
    display: none;
  }
}
</style>