<template>
  <div class="carrossel-container">
    <div class="carrossel-header">
      <h2>{{ titulo }}</h2>
      <div class="arrows">
        <!-- Ícone de rolar para a esquerda -->
        <button class="arrow left" @click="scrollLeft">
          <i class="fas fa-chevron-left"></i>
        </button>
        <!-- Ícone de rolar para a direita -->
        <button class="arrow right" @click="scrollRight">
          <i class="fas fa-chevron-right"></i>
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
        left: -200, // Valor ajustável para a quantidade de rolagem
        behavior: "smooth"
      });
    },
    // Função para rolar o carrossel para a direita
    scrollRight() {
      this.$refs.carousel.scrollBy({
        left: 200, // Valor ajustável para a quantidade de rolagem
        behavior: "smooth"
      });
    }
  }
};
</script>





<style scoped>
@import "@/assets/css/variables.css";

.carrossel-container {
  margin-bottom: 30px;
  background-color: var(--background-color-transp-black);
  /* Fundo com transparência preta */
  border-radius: 10px;
  position: relative;
  /* Necessário para os botões de rolagem serem posicionados corretamente */
}

/* Cabeçalho com título e setas */
.carrossel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

/* Estilo dos títulos */
.carrossel-container h2 {
  font-family: var(--font-oxygen);
  font-size: 24px;
  color: var(--secondary-color);
  /* Cor branca */
}

/* Container dos botões de seta */
.arrows {
  display: flex;
  gap: 10px;
}

/* Estilos para as setas de rolagem */
.arrow {
  background: none;
  border: none;
  color: var(--secondary-color);
  /* Cor branca */
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
}

.arrow:hover {
  color: var(--primary-color);
  /* Cor primária ao passar o mouse */
}

/* Estilo do carrossel */
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  /* Para navegadores Firefox */
  -ms-overflow-style: none;
  /* Para Internet Explorer e Edge */
}

.carousel::-webkit-scrollbar {
  display: none;
  /* Para navegadores baseados em Webkit (Chrome, Safari) */
}

.item {
  flex: 0 0 auto;
  width: 160px;
  padding: 15px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s ease;
  /* Suaviza a transição do background */
}

.item:hover {
  background-color: var(--background-color-transp-gray);
  border-radius: 10px;
  /* Mantém os cantos arredondados no hover */
}

.capa-img {
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.item p {
  font-family: var(--font-nunito-sans);
  font-size: 14px;
  color: var(--secondary-color);
  margin-top: 5px;
  transition: color 0.3s ease;
  /* Suaviza a transição de cor */
}

.item:hover p {
  color: var(--primary-color);
  /* Muda para a cor primária (vermelha) ao passar o mouse */

  /* Media query para telas com largura abaixo de 480px */
}

@media (max-width: 480px) {

  .carrossel-container h2 {
    font-family: var(--font-oxygen);
    font-size: 20px;
    color: var(--secondary-color);
    /* Cor branca */
  }




  .item {
    width: 100px;
    /* Reduz o tamanho da capa para 100px de largura */
    padding: 10px;
    /* Reduz o espaçamento ao redor das capas */
  }

  .capa-img {
    width: 100px;
    /* Garante que a capa se ajuste ao novo tamanho do item */
    height: auto;
    /* Mantém a proporção da imagem */
    border-radius: 8px;
    /* Opcional: ajusta o arredondamento dos cantos */
  }

  .item p {
    font-size: 12px;
    /* Reduz o tamanho da fonte dos títulos das capas */
  }

  .carousel {
    gap: 8px;
  }

  .arrow {
    font-size: 20px;
  }
}
</style>
