<template>
  <div class="inicio">
    <!-- Componente de Background -->
    <MainBackground />

    <!-- Cabeçalho -->
    <header class="header">
      <div class="icon perfil" @click="tooltip('Configurações em breve.')">
        <i class="fas fa-user-circle"></i>
      </div>
      <h1 class="title">
        <span class="mezzomo">mezzomo </span>
        <span class="music">music</span>
      </h1>
      <div class="icon busca" @click="tooltip('Busca em breve.')">
        <i class="fas fa-search"></i>
      </div>
    </header>

    <!-- Carrossel de Meus Cursos -->
    <MainCarrossel v-if="cursos.length > 0" :items="cursos" titulo="Meus Cursos" @itemSelecionado="abrirCurso" />

    <!-- Carrossel de Conheça os Cursos (se não houver cursos dinâmicos) -->
    <MainCarrossel v-else :items="cursosSugeridos" titulo="Conheça os Cursos" @itemSelecionado="tooltip" />

    <!-- Carrossel de Minhas Trilhas -->
    <MainCarrossel v-if="trilhas.length > 0" :items="trilhas" titulo="Minhas Trilhas" @itemSelecionado="abrirTrilha" />

    <!-- Carrossel de Conheça as Trilhas -->
    <MainCarrossel v-else :items="trilhasSugeridas" titulo="Conheça as Trilhas" @itemSelecionado="tooltip" />

    <!-- Exibir erro se houver -->
    <p v-if="error">{{ error }}</p>
  </div>
</template>





<script>
import MainBackground from '@/components/MainBackground.vue';
import MainCarrossel from '@/components/MainCarrossel.vue';

export default {
  components: {
    MainBackground,
    MainCarrossel
  },
  data() {
    return {
      cursos: [],
      trilhas: [],
      error: null,
      cursosSugeridos: [
        { id: 1, nome: "Curso de Inglês", capa: "/img/cursos/ingles.webp" },
        { id: 2, nome: "Curso de Alemão", capa: "/img/cursos/alemao.webp" }
      ],
      trilhasSugeridas: [
        { id: 1, nome: "Trilha de Alemão", capa: "/img/trilhas/alemao.webp" },
        { id: 2, nome: "Trilha de Inglês", capa: "/img/trilhas/ingles.webp" }
      ]
    };
  },
  created() {
    this.loadCursosTrilhas();
  },
  methods: {
    async loadCursosTrilhas() {
      try {
        // Carregar cursos dinamicamente a partir de 'acervo/cursos'
        const cursosResponse = await fetch('/acervo/cursos/cursos.json');
        if (!cursosResponse.ok) throw new Error('Falha ao carregar cursos');

        const cursosList = await cursosResponse.json();
        this.cursos = cursosList.map(curso => ({
          id: curso.id,
          nome: curso.nome,
          capa: `/acervo/cursos/${curso.id}/cover.webp`
        }));

        // Carregar trilhas dinamicamente a partir de 'acervo/trilhas'
        const trilhasResponse = await fetch('/acervo/trilhas/trilhas.json');
        if (!trilhasResponse.ok) throw new Error('Falha ao carregar trilhas');

        const trilhasList = await trilhasResponse.json();
        this.trilhas = trilhasList.map(trilha => ({
          id: trilha.id,
          nome: trilha.nome,
          // Agora, buscamos a imagem 'cover.webp' dentro da pasta de cada trilha
          capa: `/acervo/trilhas/${trilha.nome}/cover.webp` // Usamos o nome da trilha como o nome da pasta
        }));

      } catch (err) {
        this.error = 'Erro ao carregar cursos e trilhas: ' + err.message;
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
  padding: 0px var(--padding-lateral);
  background-color: transparent;
  color: var(--primary-color);
}

.header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--secondary-color);
  /* Adiciona a linha branca fina */
  padding-bottom: 10px;
  /* Adiciona espaço abaixo do conteúdo */
}

.header .icon {
  cursor: pointer;
  font-size: 24px;
  color: var(--secondary-color);
}

.header .title {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-color);
  display: flex;
  align-items: center;
}

.header .title .mezzomo {
  font-family: var(--font-oxygen);
}

.header .title .music {
  font-family: var(--font-nunito-sans);
  font-size: 30px;
  /* Ajuste este valor até que as fontes fiquem da mesma altura */
  margin-left: 5px;
  font-weight: 300;
}

.section {
  margin-bottom: 30px;
}

/* Media query para telas com largura abaixo de 480px */
@media (max-width: 480px) {

  .header .icon {
    font-size: 20px;
  }

  .header .title {
    font-size: 20px;
    /* Diminui o tamanho da fonte do título */
  }

  .header .title .music {
    font-size: 22px;
    /* Ajuste proporcional para manter o design */
  }

  .inicio {
    padding: 0 10px;
    /* Reduz a distância lateral em telas menores */
  }

  .carousel .item {
    width: 80px;
    /* Diminui a largura dos itens (capas) no carrossel */
  }

  .carousel .item p {
    font-size: 12px;
    /* Diminui o tamanho da fonte dos nomes dos cursos/trilhas */
  }

  .carousel {
    gap: 10px;
    /* Ajusta o espaçamento entre os itens do carrossel */
  }
}
</style>
