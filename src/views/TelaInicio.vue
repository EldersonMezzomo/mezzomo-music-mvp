<!-- TelaInicio.vue -->
<template>
  <div class="inicio">

    <!-- Cabeçalho -->
    <header class="header">
      <div class="header-container">
        <div class="icon perfil" @click="tooltip('Configurações em breve.')">
          <i class="fa-solid fa-circle-user"></i>
        </div>
        <h1 class="title">
          <span class="mezzomo">mezzomo </span>
          <span class="music">music</span>
        </h1>
        <div class="icon busca" @click="tooltip('Busca em breve.')">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>
    </header>

    <!-- Conteúdo Principal -->
    <div class="main-content">
      
      <!-- Carrossel de Meus Cursos -->
      <MainCarrossel v-if="cursos.length > 0" :items="cursos" titulo="Meus Cursos" @itemSelecionado="abrirCurso" />

      <!-- Carrossel de Conheça os Cursos (se não houver cursos dinâmicos) -->
      <MainCarrossel v-else :items="cursosSugeridos" titulo="Conheça os Cursos" @itemSelecionado="tooltip" />

      <!-- Carrossel de Minhas Trilhas -->
      <MainCarrossel v-if="trilhas.length > 0" :items="trilhas" titulo="Minhas Trilhas"
        @itemSelecionado="abrirTrilha" />

      <!-- Carrossel de Conheça as Trilhas -->
      <MainCarrossel v-else :items="trilhasSugeridas" titulo="Conheça as Trilhas" @itemSelecionado="tooltip" />

      <!-- Exibir erro se houver -->
      <p v-if="error">{{ error }}</p>
    </div>
  </div>
</template>




<script>
import MainCarrossel from '@/components/MainCarrossel.vue';

export default {
  components: {
    MainCarrossel
  },
  data() {
    return {
      cursos: [],
      trilhas: [],
      error: null,
      // Cursos sugeridos comentados para implementação posterior
      /*
      cursosSugeridos: [
        { id: 1, nome: "Curso de Inglês", capa: "/img/cursos/ingles.webp" },
        { id: 2, nome: "Curso de Alemão", capa: "/img/cursos/alemao.webp" }
      ],
      trilhasSugeridas: [
        { id: 1, nome: "Trilha de Alemão", capa: "/img/trilhas/alemao.webp" },
        { id: 2, nome: "Trilha de Inglês", capa: "/img/trilhas/ingles.webp" }
      ],
      */
      scrollTimeout: null
    };
  },
  created() {
    this.loadCursosTrilhas();
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async loadCursosTrilhas() {
      try {
        const cursosResponse = await fetch('/acervo/cursos/cursos.json');
        if (!cursosResponse.ok) throw new Error('Falha ao carregar cursos');

        const cursosList = await cursosResponse.json();
        this.cursos = cursosList.map(curso => ({
          id: curso.id,
          nome: curso.nome,
          capa: `/acervo/cursos/${curso.id}/cover-130.webp`
        }));

        const trilhasResponse = await fetch('/acervo/trilhas/trilhas.json');
        if (!trilhasResponse.ok) throw new Error('Falha ao carregar trilhas');

        const trilhasList = await trilhasResponse.json();
        this.trilhas = trilhasList.map(trilha => ({
          id: trilha.id,
          nome: trilha.nome,
          capa: `/acervo/trilhas/${trilha.id}/cover-130.webp`
        }));

      } catch (err) {
        this.error = 'Erro ao carregar cursos e trilhas: ' + err.message;
      }
    },
    handleScroll() {
      const header = document.querySelector('.header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }
        this.scrollTimeout = setTimeout(() => {
          header.classList.remove('scrolled');
        }, 1500);
      } else {
        header.classList.remove('scrolled');
      }
    },
    tooltip(mensagem) {
      alert(mensagem);
    },
    abrirCurso(curso) {
      this.$router.push({ name: 'TelaCurso', params: { id: curso.id } });
    },
    abrirTrilha(trilha) {
      this.$router.push({ path: `/trilha/${trilha.id}` });
    }
  }
};
</script>




<style scoped>
@import "@/assets/css/variables.css";

.inicio {
  color: var(--color-primary);
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: var(--color-dark);
  transition: background-color 0.3s, opacity 0.3s;
}

.header-container {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 calc(var(--padding-default) * 1.125); /* 45px */
  height: calc(var(--padding-default) * 2); /* 80px */
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header.scrolled {
  background-color: var(--color-dark);
  opacity: 0.8;
}

.header .icon {
  cursor: pointer;
  font-size: var(--size-xlarge-2);
  color: var(--color-secondary);
  transition: color 0.3s ease;
}

.header .icon:hover {
  color: var(--color-primary);
}

.header .title {
  color: var(--color-primary);
  display: flex;
  align-items: baseline;
}

.header .title .mezzomo {
  font-family: var(--font-oxygen);
  font-size: var(--size-big-1);
}

.header .title .music {
  font-family: var(--font-nunito-sans);
  font-size: var(--size-big-2);
  padding-left: 10px;
  font-weight: 300;
}

.main-content {
  padding-top: calc(var(--padding-default) * 2); /* 80px */
}




/* Mobile */
@media (max-width: 480px) {

  .header .title .music {
    padding-left: 5px;
  }
}
</style>