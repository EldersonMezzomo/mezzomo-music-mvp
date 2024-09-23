<!-- TelaLetra.vue -->
<template>
  <div class="tela-letra">
    <h2>{{ aula.nome }}</h2>
    <pre>{{ letra }}</pre>
  </div>
</template>

<script>
export default {
  name: 'TelaLetra',
  data() {
    return {
      aula: {
        nome: '',
      },
      letra: '',
    };
  },
  created() {
    this.loadLetra();
  },
  methods: {
    async loadLetra() {
      const cursoId = this.$route.params.cursoId;
      const aulaId = this.$route.params.aulaId;

      // Fetch the lesson data
      const response = await fetch(`/acervo/cursos/${cursoId}/curso.json`);
      const cursoData = await response.json();
      const aula = cursoData.aulas.find((a) => a.id === parseInt(aulaId));
      this.aula.nome = aula.nome;

      // Fetch the lyrics (assumes a separate file per lesson)
      const letraResponse = await fetch(`/acervo/cursos/${cursoId}/letras/${aula.letraArquivo}`);
      this.letra = await letraResponse.text();
    },
  },
};
</script>

<style scoped>
/* Styles for TelaLetra.vue */
.tela-letra {
  padding: 20px;
  color: var(--secondary-color);
}
</style>
