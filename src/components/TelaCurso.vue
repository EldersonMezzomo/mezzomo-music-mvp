<template>
  <div class="curso">
    <button @click="$router.go(-1)" class="back-button">Voltar</button>
    <h1>{{ cursoNome }}</h1>
    
    <!-- Exibindo a capa do curso -->
    <img :src="coverImage" alt="Capa do Curso" class="cover-img" />

    <!-- Lista das faixas de áudio -->
    <div v-if="faixas.length > 0">
      <div v-for="faixa in faixas" :key="faixa" class="faixa">
        <p>{{ faixa }}</p>
        <router-link :to="{ path: '/player', query: { curso: cursoNome, faixa: faixa } }" class="player-link">Tocar</router-link>
      </div>
    </div>
    <div v-else>
      <p>Nenhuma faixa encontrada.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cursoNome: '',
      coverImage: '', // Caminho da imagem de capa
      faixas: [] // Lista de faixas será carregada manualmente ou via API
    };
  },
  created() {
    this.cursoNome = this.$route.params.curso;

    // Carregando a imagem de capa corretamente
    try {
      this.coverImage = require(`../assets/acervo/${this.cursoNome}/cover.jpg`);
    } catch (error) {
      console.error('Erro ao carregar a imagem da capa:', error);
    }

    // Simulação do carregamento das faixas manualmente
    if (this.cursoNome === 'The Joshua Tree') {
      this.faixas = ['Where the Streets Have No Name.mp3', 'I Still Haven\'t Found What I\'m Looking For.mp3', 'With or Without You.mp3'];
    } else if (this.cursoNome === 'Zooropa') {
      this.faixas = ['Zooropa.mp3', 'Babyface.mp3', 'Numb.mp3'];
    } else {
      console.error('Curso não encontrado');
    }
  }
};
</script>

<style scoped>
.curso {
  background-color: #181818;
  padding: 20px;
  color: #FF2800;
}

.cover-img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin-bottom: 20px;
}

.back-button {
  background-color: #FF2800;
  color: white;
  padding: 10px;
  margin-bottom: 20px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.faixa {
  margin-bottom: 10px;
}

.player-link {
  background-color: #FF2800;
  color: white;
  padding: 10px;
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
