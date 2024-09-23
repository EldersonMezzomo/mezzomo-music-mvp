<!-- TelaPlayer.vue -->
<template>
  <div class="tela-player">
    <!-- Header -->
    <div class="player-header">
      <button class="btn-voltar" @click="voltar">
        <i class="fas fa-arrow-left"></i>
      </button>
      <div class="titles">
        <div class="curso-nome" :title="curso.nome">{{ curso.nome }}</div>
        <div class="aula-nome" :title="aula.nome">{{ aula.nome }}</div>
      </div>
      <button class="btn-favoritar" @click="toggleFavorito">
        <i :class="aula.favorito ? 'fas fa-star' : 'far fa-star'"></i>
      </button>
    </div>
    <!-- Course Cover -->
    <div class="capa-container">
      <img :src="curso.capa" :alt="curso.nome" class="capa-img" />
    </div>
    <!-- "Ver Letra" Button -->
    <button class="btn-ver-letra" @click="verLetra">
      Ver Letra
    </button>
    <!-- Audio Player with Controls -->
    <AudioPlayer ref="audioPlayer" :src="aula.arquivo" :autoplay="true" :showRewind="true" :showForward="true"
      :showProgress="true" @rewind="rewind" @forward="forward" @ended="onEnded" />
    <!-- Include router-view for nested routes -->
    <router-view></router-view>
  </div>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer.vue';

export default {
  name: 'TelaPlayer',
  components: {
    AudioPlayer,
  },
  data() {
    return {
      curso: {
        nome: '',
        capa: '',
      },
      aula: {
        nome: '',
        arquivo: '',
        favorito: false,
      },
      aulas: [], // List of lessons for navigation
      currentAulaIndex: 0,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    voltar() {
      this.$router.go(-1);
    },
    async loadData() {
      const cursoId = this.$route.params.cursoId;
      const aulaId = parseInt(this.$route.params.aulaId);

      // Fetch course data
      const cursoResponse = await fetch(`/acervo/cursos/${cursoId}/curso.json`);
      const cursoData = await cursoResponse.json();
      this.curso.nome = cursoData.nome;
      this.curso.capa = `/acervo/cursos/${cursoId}/cover.webp`;
      this.aulas = cursoData.aulas;

      // Find the current lesson
      this.currentAulaIndex = this.aulas.findIndex((aula) => aula.id === aulaId);
      const currentAula = this.aulas[this.currentAulaIndex];
      this.aula.nome = currentAula.nome;
      this.aula.arquivo = `/acervo/cursos/${cursoId}/audios/${currentAula.arquivo}`;
      this.aula.favorito = currentAula.favorito || false;
    },
    toggleFavorito() {
      this.aula.favorito = !this.aula.favorito;
      // Save the favorite status (e.g., update in localStorage or backend)
    },
    verLetra() {
      this.$router.push({
        name: 'TelaLetra',
        params: {
          cursoId: this.$route.params.cursoId,
          aulaId: this.$route.params.aulaId,
        },
      });
    },
    rewind() {
      if (this.currentAulaIndex > 0) {
        this.currentAulaIndex--;
        this.updateAula();
      } else {
        // Restart current track
        this.$refs.audioPlayer.seek(0);
      }
    },
    forward() {
      if (this.currentAulaIndex < this.aulas.length - 1) {
        this.currentAulaIndex++;
        this.updateAula();
      }
    },
    onEnded() {
      // Automatically play next track
      if (this.currentAulaIndex < this.aulas.length - 1) {
        this.currentAulaIndex++;
        this.updateAula();
      } else {
        // End of playlist
      }
    },
    updateAula() {
      const currentAula = this.aulas[this.currentAulaIndex];
      this.aula.nome = currentAula.nome;
      this.aula.arquivo = `/acervo/cursos/${this.$route.params.cursoId}/audios/${currentAula.arquivo}`;
      this.aula.favorito = currentAula.favorito || false;
      // Update the audio player source
      this.$refs.audioPlayer.src = this.aula.arquivo;
    },
  },
};
</script>

<style scoped>
/* Styles for TelaPlayer.vue */
/* Ensure that titles scroll if too long */
.player-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.titles {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  margin: 0 10px;
}

.curso-nome,
.aula-nome {
  animation: scroll-text 10s linear infinite;
}

@keyframes scroll-text {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(-100%);
  }
}

/* Additional styles as needed */
</style>
