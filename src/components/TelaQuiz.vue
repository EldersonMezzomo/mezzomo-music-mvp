<template>
  <div class="quiz">
    <h2>Quiz</h2>
    <p>Pergunta {{ perguntaAtual }}: {{ pergunta }}</p>
    <div v-for="resposta in respostas" :key="resposta" class="resposta">
      <button @click="verificarResposta(resposta)">{{ resposta }}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      perguntaAtual: 1,
      pergunta: 'Qual é a capital da Alemanha?',
      respostas: ["Berlim", "Munique"],
    };
  },
  methods: {
    verificarResposta(resposta) {
      if (resposta === "Berlim") {
        alert('Correto!');
      } else {
        alert('Incorreto!');
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
</style>
