<template>
  <div class="quiz">
    <h2>Quiz</h2>
    <p>Pergunta {{ perguntaAtual + 1 }}: {{ perguntaAtualTexto.pergunta }}</p>
    <div v-for="resposta in perguntaAtualTexto.respostas" :key="resposta" class="resposta">
      <button @click="verificarResposta(resposta)">{{ resposta }}</button>
    </div>

    <div v-if="mensagem" class="mensagem">
      <p>{{ mensagem }}</p>
      <button @click="proximaPergunta" v-if="perguntaAtual < quiz.length - 1">Próxima Pergunta</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quiz: [],
      perguntaAtual: 0,
      mensagem: ''
    };
  },
  computed: {
    perguntaAtualTexto() {
      return this.quiz[this.perguntaAtual];
    }
  },
  async created() {
    const curso = this.$route.params.curso;
    try {
      const response = await fetch(`/acervo/${curso}/quiz.json`);
      const data = await response.json();
      this.quiz = data.quiz;
    } catch (error) {
      console.error("Erro ao carregar o quiz:", error);
    }
  },
  methods: {
    verificarResposta(resposta) {
      const perguntaAtual = this.quiz[this.perguntaAtual];
      if (resposta === perguntaAtual.correta) {
        this.mensagem = "Correto!";
      } else {
        this.mensagem = "Incorreto! A resposta correta é: " + perguntaAtual.correta;
      }
    },
    proximaPergunta() {
      this.mensagem = '';
      if (this.perguntaAtual < this.quiz.length - 1) {
        this.perguntaAtual++;
      } else {
        this.mensagem = 'Fim do quiz!';
      }
    }
  }
};
</script>

<style scoped>
.quiz {
  padding: 20px;
  background-color: #181818;
  color: #FF2800;
}

button {
  background-color: #FF2800;
  color: white;
  border: none;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
}

.mensagem {
  margin-top: 20px;
}

.mensagem p {
  font-size: 18px;
  font-weight: bold;
}

</style>
