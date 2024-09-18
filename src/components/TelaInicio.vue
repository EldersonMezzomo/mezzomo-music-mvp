<template>
  <div class="inicio">
    <h1>Mezzomo Music</h1>
    <div class="courses">
      <h2>Cursos Disponíveis</h2>
      <div v-for="curso in cursos" :key="curso.nome" class="curso-card">
        <!-- Carregando a capa do curso com require() -->
        <img :src="curso.capa" alt="Capa do Curso" class="cover-img" />
        <router-link :to="`/curso/${curso.nome}`" class="course-link">Ver Curso</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cursos: [
        { nome: 'The Joshua Tree', capa: '' },
        { nome: 'Zooropa', capa: '' }
      ]
    };
  },
  created() {
    // Carregando dinamicamente a capa para cada curso usando require
    this.cursos.forEach(curso => {
      try {
        curso.capa = require(`../assets/acervo/${curso.nome}/cover.jpg`);
      } catch (error) {
        console.error(`Erro ao carregar a capa do curso ${curso.nome}:`, error);
      }
    });
  }
};
</script>

<style scoped>
.inicio {
  padding: 20px;
  background-color: #181818;
  color: #FF2800;
}

.curso-card {
  margin: 20px 0;
  text-align: center;
}

.cover-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.course-link {
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
