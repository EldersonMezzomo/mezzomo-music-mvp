<template>
  <div class="tela-curso">
    <!-- Botão Voltar -->
    <button class="btn-voltar" @click="voltar">
      <i class="fas fa-arrow-left"></i> Voltar
    </button>

    <!-- Detalhes do Curso -->
    <div class="curso-detalhes">
      <!-- Capa do Curso com Botão "Adicionar à Minha Trilha" -->
      <div class="curso-capa">
        <img :src="curso.capa" :alt="curso.nome" class="capa-img" />
        <button class="btn-adicionar-trilha" @click="adicionarATrilha">
          <i class="fas fa-plus"></i>
        </button>
      </div>

      <!-- Informações do Curso -->
      <div class="curso-info">
        <h1 class="curso-nome">{{ curso.nome }}</h1>
        <p class="curso-estilo">{{ curso.estilo }}</p>
        <p class="curso-idioma">Idioma: {{ curso.idioma }}</p> <!-- Novo campo de idioma -->
        <p class="curso-descricao">{{ curso.descricao }}</p>
        <p class="curso-duracao">Duração total: {{ duracaoTotal }}</p>
        <p class="curso-data-inicio" v-if="curso.dataInicio">
          Iniciado em: {{ curso.dataInicio }}
        </p>

        <!-- Botões de Ação -->
        <div class="curso-acoes">
          <div class="curso-acao" @click="baixarAudios">
            <i class="fas fa-download"></i>
            <span>Download</span>
          </div>
          <div class="curso-acao" @click="compartilharCurso">
            <i class="fas fa-share-alt"></i>
            <span>Compartilhar</span>
          </div>
          <div class="curso-acao" @click="rolarParaComentarios">
            <i class="fas fa-comments"></i>
            <span>Comentários</span>
          </div>
          <div class="curso-acao" @click="acessarCertificado" :disabled="!certificadoDisponivel">
            <i class="fas fa-flag-checkered"></i> <!-- Ícone de bandeira quadriculada -->
            <span>Certificado</span>
          </div>
          <div class="curso-acao" @click="acessarQuiz">
            <i class="fas fa-question-circle"></i>
            <span>Quiz</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Aulas -->
    <div class="curso-aulas">
      <h2>Aulas</h2>
      <ul>
        <li v-for="(aula, index) in curso.aulas" :key="aula.id"
          :class="{ reproduzida: aula.reproduzida, executando: aula.executando }">
          <div class="aula-detalhes">
            <!-- Adiciona o AudioPlayer para cada aula -->
            <AudioPlayer :ref="(el) => { aula.audioPlayer = el; }" :src="aula.arquivo" :autoplay="false"
              :showRewind="false" :showForward="false" :showProgress="false" @play="onPlay(aula)" @pause="onPause(aula)"
              @ended="onEnded(aula)" />
            <span>{{ index + 1 }}. {{ aula.nome }}</span>
          </div>
          <div class="aula-duracao">
            <span>{{ formatarDuracao(aula.duracao) }}</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Sessão de Comentários (a ser implementada posteriormente) -->
  </div>
</template>



<script>
import AudioPlayer from '@/components/AudioPlayer.vue';

export default {
  components: {
    AudioPlayer,
  },
  data() {
    return {
      curso: {
        id: this.$route.params.id,
        nome: '',
        estilo: '',
        descricao: '',
        capa: '',
        dataInicio: null,
        aulas: [],
      },
      duracaoTotal: '0h 0min',
      certificadoDisponivel: false,
      currentAudioPlayer: null,
    };
  },
  created() {
    this.carregarCurso();
  },
  methods: {
    voltar() {
      this.$router.go(-1);
    },
    async carregarCurso() {
      try {
        // Carregar dados do curso a partir de um JSON
        const response = await fetch(`/acervo/cursos/${this.curso.id}/curso.json`);
        if (!response.ok) throw new Error('Falha ao carregar o curso');

        const dadosCurso = await response.json();

        this.curso.nome = dadosCurso.nome;
        this.curso.estilo = dadosCurso.estilo;
        this.curso.descricao = dadosCurso.descricao;
        this.curso.idioma = dadosCurso.idioma; // Adiciona o idioma aqui
        this.curso.capa = `/acervo/cursos/${this.curso.id}/cover.webp`;
        this.curso.dataInicio = dadosCurso.dataInicio || null;


        this.curso.aulas = dadosCurso.aulas.map((aula, index) => ({
          id: aula.id || index + 1,
          nome: aula.nome,
          duracao: aula.duracao, // duração em segundos
          reproduzida: aula.reproduzida || false,
          baixada: aula.baixada || false,
          arquivo: `/acervo/cursos/${this.curso.id}/${aula.arquivo}`, // Certifica-se de usar o nome do arquivo MP3
        }));

        this.calcularDuracaoTotal();
        this.verificarCertificadoDisponivel();
      } catch (err) {
        console.error('Erro ao carregar o curso:', err);
      }
    },
    calcularDuracaoTotal() {
      let totalSegundos = this.curso.aulas.reduce(
        (total, aula) => total + aula.duracao,
        0
      );
      const horas = Math.floor(totalSegundos / 3600);
      const minutos = Math.floor((totalSegundos % 3600) / 60);
      this.duracaoTotal = `${horas}h ${minutos}min`;
    },
    verificarCertificadoDisponivel() {
      // Implementar lógica para verificar se o certificado está disponível
      this.certificadoDisponivel = false;
    },
    adicionarATrilha() {
      // Implementar a lógica para adicionar o curso à "Minha Trilha"
      alert('Curso adicionado à Minha Trilha!');
    },
    baixarAudios() {
      // Implementar a lógica para baixar todos os áudios do curso
      alert('Download iniciado para todos os áudios do curso.');
    },
    compartilharCurso() {
      // Implementar a lógica para compartilhar o curso
      alert('Compartilhar curso (funcionalidade em desenvolvimento).');
    },
    rolarParaComentarios() {
      // Implementar a lógica para rolar até a sessão de comentários
      alert('Rolando para a sessão de comentários.');
    },
    acessarCertificado() {
      if (this.certificadoDisponivel) {
        // Redirecionar para a tela de certificado
        this.$router.push({ path: `/certificado/${this.curso.id}` });
      }
    },
    acessarQuiz() {
      // Redirecionar para a tela de quiz do curso
      this.$router.push({ path: `/quiz/${this.curso.id}` });
    },
    tocarAula(aula) {
      // Implementar a lógica para tocar a aula selecionada
      alert(`Reproduzindo aula: ${aula.nome}`);
      // Aqui você pode iniciar a reprodução e exibir os controles no rodapé
    },
    baixarAula(aula) {
      // Implementar a lógica para baixar a aula
      aula.baixada = true;
      alert(`Aula "${aula.nome}" baixada com sucesso!`);
    },
    onPlay(aula) {
      // Pause any currently playing audio
      if (this.currentAudioPlayer && this.currentAudioPlayer !== aula.audioPlayer) {
        this.currentAudioPlayer.pauseAudio();
      }
      // Set the current audio player
      this.currentAudioPlayer = aula.audioPlayer;
      aula.executando = true;
    },
    onPause(aula) {
      aula.executando = false;
    },
    onEnded(aula) {
      aula.executando = false;
    },
    formatarDuracao(segundos) {
      const minutos = Math.floor(segundos / 60);
      const segundosRestantes = segundos % 60;

      // Garantir que os segundos sejam exibidos com dois dígitos
      const segundosFormatados = segundosRestantes < 10 ? `0${segundosRestantes}` : segundosRestantes;

      // Retornar no formato "mm:ss"
      return `${minutos}:${segundosFormatados}`;
    },
  },
  mounted() {
    // Initialize the audio players
    this.curso.aulas.forEach((aula) => {
      aula.audioPlayer = null;
    });
  },
};
</script>



<style scoped>
@import "@/assets/css/variables.css";

.tela-curso {
  padding: 20px var(--padding-lateral);
  color: var(--secondary-color);
}

.btn-voltar {
  background: none;
  border: none;
  color: var(--secondary-color);
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 20px;
}

.btn-voltar:hover {
  color: var(--primary-color);
  /* Muda para a cor vermelha ao passar o mouse */
}

.curso-detalhes {
  display: flex;
  flex-wrap: wrap;
  margin: 30px 0;
  background-color: var(--background-color-transp-black);
  height: 350px;
}

.curso-capa {
  position: relative;
}

.capa-img {
  width: 300px;
  height: auto;
  border-radius: 10px;
}

.btn-adicionar-trilha {
  position: absolute;
  bottom: 60px;
  right: 10px;
  background-color: var(--primary-color);
  border: none;
  color: var(--secondary-color);
  font-size: 18px;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
}

.curso-info {
  flex: 1;
  margin-left: 30px;
}

.curso-nome {
  font-family: var(--font-oxygen);
  font-size: 28px;
  color: var(--primary-color);
  margin-bottom: 10px;
}

.curso-estilo {
  font-size: 18px;
  font-style: italic;
  margin-bottom: 10px;
}

.curso-descricao {
  margin-bottom: 10px;
}

.curso-duracao,
.curso-data-inicio {
  margin-bottom: 5px;
}

.curso-acoes {
  display: flex;
  margin-top: 20px;
  gap: 40px;
}

.curso-acao {
  text-align: center;
  cursor: pointer;
  color: var(--secondary-color);
  font-size: 16px;
  transition: color 0.3s;
}

.curso-acao i {
  font-size: 24px;
  display: block;
}

.curso-acao span {
  display: block;
  margin-top: 5px;
}

.curso-acao:hover {
  color: var(--primary-color);
  /* Torna o ícone e o texto vermelhos ao passar o mouse */
}


.curso-aulas {
  margin-bottom: 30px;
  margin-top: 50px;
  background-color: var(--background-color-transp-black);
}

.curso-aulas h2 {
  font-family: var(--font-oxygen);
  font-size: 24px;
  color: var(--secondary-color);
  margin-bottom: 15px;
}

.curso-aulas ul {
  list-style: none;
  padding: 0;
}

.curso-aulas li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.curso-aulas li:hover {
  border: 2px solid var(--primary-color);
  /* Borda vermelha ao passar o mouse */
}


.curso-aulas li.reproduzida {
  background-color: rgba(255, 255, 255, 0.2);
}

.aula-detalhes {
  display: flex;
  align-items: center;
}

.aula-detalhes i {
  margin-right: 10px;
}

.aula-acoes i {
  font-size: 20px;
  cursor: pointer;
}

.aula-duracao {
  font-size: 14px;
  color: var(--secondary-color);
  text-align: right;
}




@media (max-width: 480px) {
  .tela-curso {
    padding: 10px;
  }

  .curso-detalhes {
    flex-direction: column;
    align-items: center;
  }

  .curso-capa {
    margin-bottom: 20px;
  }

  .curso-info {
    margin-left: 0;
    text-align: center;
  }

  .capa-img {
    width: 100%;
    max-width: 300px;
  }

  .curso-acoes {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .curso-acao {
    margin-bottom: 10px;
    width: 80px;
  }

  .curso-aulas li {
    flex-direction: column;
    align-items: flex-start;
  }

  .aula-acoes {
    align-self: flex-end;
    margin-top: 5px;
  }
}
</style>
