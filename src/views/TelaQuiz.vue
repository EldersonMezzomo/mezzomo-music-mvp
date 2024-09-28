<!-- TelaQuiz.vue -->
<template>
  <div class="tela-quiz">

    <!-- Cabeçalho -->
    <header class="quiz-header">
      <button class="btn-voltar" @click="voltar">
        <i class="fa-solid fa-arrow-left"></i> Voltar
      </button>
      <h1 class="quiz-titulo">{{ quiz.curso }}</h1>
      <div v-if="quizIniciado && perguntaAtual" class="quiz-progresso">
        <span class="palavra-pergunta">Pergunta</span> {{ perguntaAtualIndex + 1 }} de {{ totalPerguntas }}
      </div>
    </header>

    <!-- Área da Pergunta -->
    <div v-if="quizIniciado && perguntaAtual" class="quiz-pergunta">
      <h2>{{ perguntaAtual.pergunta }}</h2>
    </div>

    <!-- Opções de Resposta -->
    <div v-if="quizIniciado && perguntaAtual" class="quiz-opcoes">
      <button v-for="opcao in perguntaAtual.opcoes" :key="opcao.id" :class="[
        'opcao-btn',
        opcaoSelecionada === opcao.id ? 'selecionada' : '',
        opcaoSelecionada ? (opcao.correta ? 'correta' : 'incorreta') : ''
      ]" @click="selecionarOpcao(opcao.id)" :disabled="opcaoSelecionada">
        {{ opcao.texto }}
      </button>
    </div>

    <!-- Botão para Iniciar Quiz -->
    <div v-if="!quizIniciado" class="quiz-iniciar">
      <button class="btn-iniciar" @click="iniciarQuiz">
        Iniciar Quiz
      </button>
    </div>

    <!-- Cronômetro e Botão Próxima Pergunta -->
    <div v-if="quizIniciado && perguntaAtual" class="quiz-footer">
      <div class="indicadores-desempenho">
        <span>Acertos: {{ acertos }}</span>
        <span>|</span>
        <span>Erros: {{ erros }}</span>
        <span>|</span>
        <span>Total: {{ totalRespondidas }}</span>
      </div>
      <button class="btn-proxima" @click="proximaPergunta" :disabled="!podeAvancar">
        <span v-if="!opcaoSelecionada && tempoRestante > 0" class="cronometro">{{ tempoRestante }}</span>
        <span v-else>{{ textoBotaoProxima }}</span>
      </button>

    </div>

    <!-- Áudio de fundo -->
    <audio ref="audioRef" src="/quiz.mp3" preload="auto"></audio>

  </div>
</template>




<script>
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'TelaQuiz',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const quiz = reactive({
      curso: '',
      perguntas: [],
    });

    const quizIniciado = ref(false);
    const perguntaAtualIndex = ref(0);
    const perguntaAtual = computed(() => {
      if (quiz.perguntas.length > 0) {
        return quiz.perguntas[perguntaAtualIndex.value];
      }
      return null;
    });

    const opcaoSelecionada = ref(null);
    const podeAvancar = ref(false);

    const tempoRestante = ref(20);
    let timerInterval = null;
    let audioTimeout = null;

    const acertos = ref(0);
    const erros = ref(0);
    const totalRespondidas = computed(() => acertos.value + erros.value);
    const totalPerguntas = computed(() => quiz.perguntas.length);

    const audio = new Audio('/quiz.mp3');

    const textoBotaoProxima = computed(() => {
      if (perguntaAtualIndex.value < quiz.perguntas.length - 1) {
        return opcaoSelecionada.value || tempoRestante.value === 0 ? 'Próxima Pergunta' : `${tempoRestante.value}`;
      } else {
        return 'Finalizar Quiz';
      }
    });

    // Carregar dados do quiz
    const carregarQuiz = async () => {
      try {
        const cursoId = route.params.id;
        const response = await fetch(`/acervo/cursos/${cursoId}/quiz.json`);
        const data = await response.json();
        quiz.curso = data.quiz.curso;
        quiz.perguntas = data.quiz.perguntas;
      } catch (error) {
        console.error('Erro ao carregar o quiz:', error);
      }
    };

    // Função para iniciar o quiz
    const iniciarQuiz = () => {
      quizIniciado.value = true;
      iniciarCronometro();
    };

    // Sincronizar o áudio com o cronômetro
    const sincronizarAudioComCronometro = () => {
      audio.currentTime = 0; // Reinicia o áudio
      audio.play().catch((error) => {
        console.error('Erro ao tentar reproduzir o áudio:', error);
      });

      audioTimeout = setTimeout(() => {
        audio.pause();
      }, tempoRestante.value * 1000);
    };

    const pararAudio = () => {
      clearTimeout(audioTimeout);
      audio.pause();
    };

    // Iniciar cronômetro
    const iniciarCronometro = () => {
      tempoRestante.value = 20;
      sincronizarAudioComCronometro();

      timerInterval = setInterval(() => {
        if (tempoRestante.value > 0) {
          tempoRestante.value--;
        } else {
          clearInterval(timerInterval);
          erros.value++;
          podeAvancar.value = true;

          if (!opcaoSelecionada.value) {
            const opcaoCorreta = perguntaAtual.value.opcoes.find((opcao) => opcao.correta);
            opcaoSelecionada.value = opcaoCorreta.id;
          }

          pararAudio();
        }
      }, 1000);
    };

    const selecionarOpcao = (opcaoId) => {
      if (opcaoSelecionada.value) return;

      opcaoSelecionada.value = opcaoId;
      clearInterval(timerInterval);
      podeAvancar.value = true;

      const opcao = perguntaAtual.value.opcoes.find((o) => o.id === opcaoId);
      if (opcao.correta) {
        acertos.value++;
      } else {
        erros.value++;
      }

      pararAudio();
    };

    const proximaPergunta = () => {
      if (perguntaAtualIndex.value < quiz.perguntas.length - 1) {
        perguntaAtualIndex.value++;
        opcaoSelecionada.value = null;
        podeAvancar.value = false;
        iniciarCronometro();
      } else {
        finalizarQuiz();
      }
    };

    const finalizarQuiz = () => {
      console.log('Quiz finalizado!');
      pararAudio();
      router.push(`/curso/${route.params.id}`);
    };

    const voltar = () => {
      pararAudio();
      router.push(`/curso/${route.params.id}`);
    };

    onMounted(async () => {
      await carregarQuiz();
    });

    onUnmounted(() => {
      clearInterval(timerInterval);
      pararAudio();
    });

    return {
      quiz,
      quizIniciado,
      perguntaAtual,
      perguntaAtualIndex,
      opcaoSelecionada,
      selecionarOpcao,
      tempoRestante,
      proximaPergunta,
      podeAvancar,
      textoBotaoProxima,
      acertos,
      erros,
      totalRespondidas,
      totalPerguntas,
      iniciarQuiz,
      voltar,
    };
  },
};
</script>




<style scoped>
@import "@/assets/css/variables.css";

.tela-quiz {
  position: relative;
  z-index: 1;
  color: var(--color-secondary);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.quiz-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-dark);
  padding: 0 calc(var(--padding-default) * 1.125); /* 45px */
  height: calc(var(--padding-default) * 2); /* 80px */
}

.btn-voltar {
  font-family: var(--font-nunito-sans);
  position: absolute;
  left: calc(var(--padding-default) * 1.125); /* 45px */
  background: none;
  border: none;
  color: var(--color-secondary);
  font-size: var(--size-xlarge-2);
  cursor: pointer;
}

.btn-voltar:hover {
  color: var(--color-primary);
}

.quiz-titulo {
  font-size: var(--size-big-1);
  margin: 0;
  font-family: var(--font-oxygen);
  text-align: center;
  color: var(--color-primary);
}

.quiz-progresso {
  font-family: var(--font-nunito-sans);
  position: absolute;
  right: calc(var(--padding-default) * 1.125); /* 45px */
  font-size: var(--size-xlarge-2);
  color: var(--color-secondary);
}

.quiz-pergunta {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.quiz-pergunta h2 {
  font-size: var(--size-xlarge-2);
  text-align: center;
  padding: 0 calc(var(--padding-default) * 1.125);
}

.quiz-opcoes {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.opcao-btn {
  width: 100%;
  max-width: calc(100% - calc(var(--padding-default) * 2.375));
  padding: calc(var(--padding-default) * 0.25); /* 10px */
  margin: calc(var(--padding-default) * 0.125) 0; /* 5px */
  font-size: var(--size-large-2);
  cursor: pointer;
  background-color: rgba(var(--color-secondary-rgb), 0.09);
  color: var(--color-secondary);
  border: 2px solid transparent;
  border-radius: 5px;
  font-family: var(--font-nunito-sans);
}

.opcao-btn:hover {
  background-color: rgba(var(--color-primary-rgb), 0.3);
}

.opcao-btn.correta {
  background-color: var(--color-highlight);
  color: var(--color-secondary);
}

.opcao-btn.incorreta {
  background-color: var(--color-primary);
  color: var(--color-secondary);
}

.opcao-btn.selecionada {
  border-color: var(--color-secondary);
}

.quiz-iniciar {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.btn-iniciar {
  font-family: var(--font-nunito-sans);
  font-weight: bold;
  background-color: var(--color-primary);
  color: var(--color-secondary);
  font-size: var(--size-xlarge-2);
  padding: calc(var(--padding-default) * 0.375) calc(var(--padding-default) * 0.75); /* 15px 30px */
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.btn-iniciar:hover {
  background-color: rgba(var(--color-primary-rgb), 0.8);
}

.quiz-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(var(--color-dark-rgb), 0.4);
  margin-top: calc(var(--padding-default) * 1.125); /* 45px */
  padding: 0 calc(var(--padding-default) * 1.125); /* 45px */
  height: calc(var(--padding-default) * 2); /* 80px */
}

.indicadores-desempenho span {
  margin: 0 calc(var(--padding-default) * 0.125); /* 5px */
}

.btn-proxima {
  width: calc(var(--padding-default) * 5); /* 200px */
  height: calc(var(--padding-default) * 1.25); /* 50px */
  background-color: var(--color-secondary);
  color: var(--color-primary);
  font-weight: bold;
  padding: calc(var(--padding-default) * 0.25) calc(var(--padding-default) * 0.375); /* 10px 15px */
  border: none;
  cursor: pointer;
  font-size: var(--size-large-1);
  border-radius: 5px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--color-primary);
}

.btn-proxima:hover {
  background-color: rgba(var(--color-secondary-rgb), 0.8);
}

.btn-proxima span {
  width: 100%;
  text-align: center;
}

.btn-proxima .cronometro {
  color: var(--color-primary);
}

.btn-proxima:disabled {
  background-color: rgba(var(--color-secondary-rgb), 0.09);
  cursor: not-allowed;
  color: var(--color-secondary);
}




/* Tablet */
@media (max-width: 768px) {
  
  .palavra-pergunta {
    display: none;
  }
}




/* Mobile */
@media (max-width: 480px) {
  
  .quiz-titulo {
    display: none;
  }

  .indicadores-desempenho {
    font-size: var(--size-small-3);
  }

  .btn-proxima {
    padding: 20px 0;
  }
}
</style>