<template>
  <div class="player">
    <button @click="$router.go(-1)" class="back-button">Voltar</button>
    <h2>Tocando: {{ faixaAtual }}</h2>

    <!-- Player de áudio -->
    <audio :src="audioSource" controls autoplay></audio>

    <router-link :to="{ path: '/letra', query: { letra: letra } }" class="letra-link">Ver Letra</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curso: this.$route.query.curso,
      faixaAtual: this.$route.query.faixa,
      audioSource: '',
      letra: 'Aqui vai a letra da música...'
    };
  },
  created() {
    // Carregando o arquivo de áudio corretamente
    try {
      // Utilizando require para garantir que o caminho do arquivo MP3 seja resolvido corretamente
      this.audioSource = require(`../assets/acervo/${this.curso}/${this.faixaAtual}`);
    } catch (error) {
      console.error('Erro ao carregar o arquivo de áudio:', error);
    }
  }
};
</script>

<style scoped>
.player {
  background-color: #181818;
  padding: 20px;
  color: #FF2800;
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

audio {
  width: 100%;
  margin-top: 20px;
}

.letra-link {
  display: inline-block;
  margin-top: 10px;
  background-color: #FF2800;
  color: white;
  padding: 10px;
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
