<!-- TelaPlayer.vue -->
<template>
  <div class="tela-player">
    <!-- Cabeçalho -->
    <div class="player-header">
      <button class="btn-voltar" @click="voltar">
        <i class="fas fa-arrow-left"></i> Voltar
      </button>
      <button class="btn-favoritar" @click="toggleFavorito">
        <i :class="aula.favorito ? 'fas fa-star' : 'far fa-star'"></i>
      </button>
    </div>

    <!-- Sessão de Exibição da Capa ou Letra -->
    <div class="media-section">
      <img v-if="mostrarCapa" :src="curso.capa" :alt="curso.nome" class="capa-img" />
      <!-- Exibição das Letras -->
      <div v-else class="exibir-letra">
        <div class="letras-container">
          <div class="letras" :style="{ transform: `translateY(${scrollPosition}px)` }">
            <p v-for="(linha, index) in letras" :key="index" :class="{ ativa: index === linhaAtual }">
              {{ linha.texto }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Rodapé: Controles de áudio e informações -->
    <div class="player-footer">
      <!-- Primeira linha: Nome da faixa e botão de alternar letra -->
      <div class="info-line">
        <span class="aula-nome">{{ aula.nome }}</span>
        <button class="btn-ver-letra" @click="toggleLetra">
          <i class="fas fa-music"></i> Ver Letra
        </button>
      </div>
      <!-- Segunda linha: Nome do curso -->
      <div class="info-line">
        <span class="curso-nome">{{ curso.nome }}</span>
        <button class="btn-repeat" @click="toggleRepeat">
          <i :class="repeat ? 'fas fa-repeat' : 'fas fa-repeat'"></i>
        </button>
      </div>

      <!-- Barra de progresso e tempos -->
      <AudioPlayer
        ref="audioPlayer"
        :src="aula.arquivo"
        :autoplay="true"
        :showRewind="true"
        :showForward="true"
        :showProgress="true"
        @rewind="rewind"
        @forward="forward"
        @ended="onEnded"
        @timeupdate="updateTime"
      />
    </div>
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
      mostrarCapa: true,
      currentTime: 0, // Para sincronizar o tempo
      curso: {
        nome: '',
        capa: '',
      },
      aula: {
        nome: '',
        arquivo: '',
        arquivoLRC: '',
        favorito: false,
      },
      letras: [], // Para armazenar as letras carregadas do arquivo LRC
      linhaAtual: 0, // Índice da linha atual da letra
      aulas: [],
      currentAulaIndex: 0,
      repeat: false,
      scrollPosition: 0, // Controla a posição do scroll das letras
      lineHeight: 40, // Altura total de cada linha (line-height + margin)
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

      // Encontrar a aula atual
      this.currentAulaIndex = this.aulas.findIndex(
        (aula) => aula.id === aulaId
      );
      this.updateAula();
    },
    async carregarLetras() {
      try {
        const response = await fetch(this.aula.arquivoLRC);
        const texto = await response.text();
        this.letras = this.parseLRC(texto);
      } catch (error) {
        console.error('Erro ao carregar o arquivo LRC:', error);
      }
    },
    parseLRC(lrcContent) {
      const linhas = lrcContent.split('\n');
      return linhas
        .map((linha) => {
          const match = linha.match(/\[(\d{2}):(\d{2}):(\d{2})\](.*)/);
          if (match) {
            const horas = parseInt(match[1], 10);
            const minutos = parseInt(match[2], 10);
            const segundos = parseInt(match[3], 10);
            const tempo = horas * 3600 + minutos * 60 + segundos;
            return { tempo, texto: match[4] };
          }
          return null;
        })
        .filter(Boolean); // Filtra linhas válidas
    },
    toggleFavorito() {
      this.aula.favorito = !this.aula.favorito;
    },
    toggleLetra() {
      this.mostrarCapa = !this.mostrarCapa;
    },
    rewind() {
      if (this.currentAulaIndex === 0) {
        return;
      }
      this.currentAulaIndex--;
      this.updateAula();
    },
    forward() {
      if (this.currentAulaIndex < this.aulas.length - 1) {
        this.currentAulaIndex++;
        this.updateAula();
      } else {
        this.currentAulaIndex = 0;
        this.updateAula();
      }
    },
    onEnded() {
      if (this.currentAulaIndex < this.aulas.length - 1) {
        this.currentAulaIndex++;
      } else if (this.repeat) {
        this.currentAulaIndex = 0;
      } else {
        return;
      }
      this.updateAula();
    },
    updateTime(currentTime) {
      this.currentTime = currentTime;
      this.updateLinhaAtual();
    },
    updateLinhaAtual() {
      const index = this.letras.findIndex((letra) => letra.tempo > this.currentTime);
      this.linhaAtual = index === -1 ? this.letras.length - 1 : index - 1;

      // Calcular a posição de deslocamento para centralizar a linha atual
      const lineHeight = this.lineHeight;
      const containerHeight = lineHeight * 7; // 7 linhas visíveis
      const offset = (containerHeight / 2) - (lineHeight / 2);
      let scrollPosition = -(this.linhaAtual * lineHeight - offset);

      // Limitar o deslocamento para não ultrapassar as extremidades
      const totalHeight = this.letras.length * lineHeight;
      const maxScroll = 0;
      const minScroll = -(totalHeight - containerHeight);

      scrollPosition = Math.min(scrollPosition, maxScroll);
      scrollPosition = Math.max(scrollPosition, minScroll);

      this.scrollPosition = scrollPosition;
    },
    updateAula() {
      const cursoIdEncoded = encodeURIComponent(this.$route.params.cursoId);
      const currentAula = this.aulas[this.currentAulaIndex];
      this.aula.nome = currentAula.nome;
      this.aula.arquivo = `/acervo/cursos/${cursoIdEncoded}/${currentAula.arquivo}`;
      this.aula.arquivoLRC = `/acervo/cursos/${cursoIdEncoded}/${currentAula.arquivo.replace('.mp3', '.lrc')}`;
      this.aula.favorito = currentAula.favorito || false;

      // Carregar as letras da música
      this.carregarLetras();

      // Reiniciar o currentTime para 0 ao mudar de faixa
      this.currentTime = 0;
      this.linhaAtual = 0;
      this.scrollPosition = 0;

      // Atualizar o src do componente de áudio e reproduzir
      const audioPlayer = this.$refs.audioPlayer.$el.querySelector('audio');
      if (audioPlayer) {
        audioPlayer.src = this.aula.arquivo;
        audioPlayer.load();
        audioPlayer.play().catch((error) => {
          console.error('Erro ao tentar reproduzir o áudio:', error);
        });
      }
    },
    toggleRepeat() {
      this.repeat = !this.repeat;
    },
  },
};
</script>













<style scoped>
@import "@/assets/css/variables.css";

.tela-player {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 40px);
  width: calc(100vw - 40px);
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}

/* Cabeçalho */
.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
}

.btn-voltar,
.btn-favoritar {
  background: none;
  border: none;
  color: var(--secondary-color);
  font-size: 18px;
  cursor: pointer;
}

.btn-voltar:hover,
.btn-favoritar:hover {
  color: var(--primary-color);
}

/* Sessão do Meio: Capa ou Letra */
.media-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 20px;
}

/* Capa da música */
.capa-img {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Exibição da letra */
.exibir-letra {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.letras-container {
  width: 100%;
  max-width: 80%;
  height: 280px; /* 7 linhas * 40px */
  overflow: hidden; /* Esconde a barra de rolagem */
  position: relative;
}

.letras {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: var(--secondary-color);
  font-family: var(--font-nunito-sans);
  font-size: 24px;
  line-height: 40px; /* Deve ser consistente com lineHeight */
  transition: transform 0.3s ease-in-out;
}

.letras p {
  margin: 0; /* Ajuste para facilitar o cálculo da altura */
  opacity: 0.5;
}

.letras p.ativa {
  opacity: 1;
  font-weight: bold;
}


/* Rodapé */
.player-footer {
  background-color: var(--background-color-transp-black);
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.info-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.aula-nome {
  font-family: var(--font-oxygen);
  color: var(--secondary-color);
  font-size: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.curso-nome {
  color: var(--secondary-color);
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-ver-letra,
.btn-repeat {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 8px 12px;
  border-radius: 15px;
  color: white;
  cursor: pointer;
}

.btn-ver-letra:hover,
.btn-repeat:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.controls {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.controls button {
  background: none;
  border: none;
  color: var(--secondary-color);
  font-size: 24px;
  margin: 0 10px;
  cursor: pointer;
}

.controls button:hover {
  color: var(--primary-color);
}

/* Ajustes para telas menores */
@media (max-width: 768px) {

  .btn-voltar,
  .btn-favoritar {
    font-size: 16px;
  }

  .capa-img {
    max-width: 200px;
  }

  .aula-nome,
  .curso-nome {
    font-size: 14px;
  }

  .btn-ver-letra,
  .btn-repeat {
    padding: 6px 10px;
  }

  .controls button {
    font-size: 20px;
  }
}
</style>

