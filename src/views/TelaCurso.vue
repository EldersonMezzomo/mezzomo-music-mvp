<template>
  <div class="tela-curso">

    <!-- Cabeçalho fixo -->
    <header class="header">
      <div class="header-container">
        <button class="btn-voltar" @click="voltar">
          <i class="fa-solid fa-arrow-left"></i> Voltar
        </button>
        <h1 class="curso-nome">{{ curso.nome }}</h1>
      </div>
    </header>

    <!-- Conteúdo Principal -->
    <div class="main-content">

      <!-- Detalhes do Curso -->
      <div class="curso-detalhes">
        <div class="curso-capa">
          <img :src="curso.capa" :alt="curso.nome" class="capa-img" />
        </div>

        <!-- Informações do Curso -->
        <div class="curso-info">
          <p class="curso-descricao">{{ curso.descricao }}<button class="btn-adicionar-trilha"
              @click="adicionarATrilha">
              <i class="fa-solid fa-plus"></i>
            </button></p>
          <p class="curso-estilo">Estilo: <span class="italico">{{ curso.estilo }}</span></p>
          <p class="curso-idioma">Idioma: <span class="italico">{{ curso.idioma }}</span></p>
          <p class="curso-duracao">Duração total: <span class="italico">{{ duracaoTotal }}</span></p>
          <p class="curso-data-inicio" v-if="curso.dataInicio">Iniciado em: <span class="italico">{{ curso.dataInicio
              }}</span></p>

          <!-- Botões de Ação -->
          <div class="curso-acoes">
            <div class="curso-acao" @click="baixarAudios">
              <i class="fa-solid fa-download"></i>
              <span>Download</span>
            </div>
            <div class="curso-acao" @click="compartilharCurso">
              <i class="fa-solid fa-share-nodes"></i>
              <span>Compartilhar</span>
            </div>
            <div class="curso-acao" @click="rolarParaComentarios">
              <i class="fa-solid fa-comments"></i>
              <span>Comentários</span>
            </div>
            <div class="curso-acao" @click="acessarCertificado" :disabled="!certificadoDisponivel">
              <i class="fa-solid fa-flag-checkered"></i>
              <span>Certificado</span>
            </div>
            <div class="curso-acao" @click="acessarQuiz">
              <i class="fa-solid fa-circle-question"></i>
              <span>Quiz</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Aulas -->
      <div class="curso-aulas">
        <h2>Aulas</h2>
        <ul>
          <li v-for="aula in curso.aulas" :key="aula.id" @click="tocarAula(aula)">
            <div class="aula-detalhes">
              <i class="fa-solid fa-play"></i>
              <span>{{ aula.nome }}</span>

            </div>
            <div class="aula-duracao">
              <span>{{ formatarDuracao(aula.duracao) }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>




<script>
export default {
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
      scrollTimeout: null,
      cursoAdicionado: false,
    };
  },
  created() {
    this.carregarCurso();
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async carregarCurso() {
      try {
        const response = await fetch(`/acervo/cursos/${this.curso.id}/curso.json`);
        if (!response.ok) throw new Error('Falha ao carregar o curso');

        const dadosCurso = await response.json();

        this.curso.nome = dadosCurso.nome;
        this.curso.estilo = dadosCurso.estilo;
        this.curso.descricao = dadosCurso.descricao;
        this.curso.idioma = dadosCurso.idioma;
        this.curso.capa = `/acervo/cursos/${this.curso.id}/cover.webp`;
        this.curso.dataInicio = dadosCurso.dataInicio || null;

        this.curso.aulas = dadosCurso.aulas.map((aula, index) => ({
          id: aula.id || index + 1,
          nome: aula.nome,
          duracao: aula.duracao,
          reproduzida: aula.reproduzida || false,
          baixada: aula.baixada || false,
          arquivo: `/acervo/cursos/${this.curso.id}/${aula.arquivo}`,
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
      this.certificadoDisponivel = false;
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
    voltar() {
      this.$router.push({ name: 'TelaInicio' });
    },
    adicionarATrilha() {
      this.cursoAdicionado = !this.cursoAdicionado;
      if (this.cursoAdicionado) {
        alert('Curso adicionado à Minha Trilha!');
      } else {
        alert('Curso removido da Minha Trilha!');
      }
    },
    baixarAudios() {
      alert('Download iniciado para todos os áudios do curso.');
    },
    compartilharCurso() {
      alert('Compartilhar curso (funcionalidade em desenvolvimento).');
    },
    rolarParaComentarios() {
      alert('Rolando para a sessão de comentários.');
    },
    acessarCertificado() {
      if (this.certificadoDisponivel) {
        this.$router.push({ path: `/certificado/${this.curso.id}` });
      }
    },
    acessarQuiz() {
      this.$router.push({ path: `/quiz/${this.curso.id}` });
    },
    tocarAula(aula) {
      this.$router.push({
        name: 'TelaPlayer',
        params: {
          cursoId: this.curso.id,
          aulaId: aula.id,
        },
      });
    },
    formatarDuracao(segundos) {
      const minutos = Math.floor(segundos / 60);
      const segundosRestantes = segundos % 60;
      const segundosFormatados = segundosRestantes < 10 ? `0${segundosRestantes}` : segundosRestantes;
      return `${minutos}:${segundosFormatados}`;
    },
  },
};
</script>




<style scoped>
@import "@/assets/css/variables.css";

.tela-curso {
  color: var(--color-secondary);
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: var(--color-dark);
  height: calc(var(--padding-default) * 2); /* 80px */
  box-sizing: border-box;
  transition: background-color 0.3s, opacity 0.3s;
}

.header.scrolled {
  background-color: var(--color-dark);
  opacity: 0.8;
}

.header-container {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0 calc(var(--padding-default) * 1.125); /* 45px */
  height: calc(var(--padding-default) * 2); /* 80px */
}

.main-content {
  padding-top: calc(var(--padding-default) * 2); /* 80px de espaçamento */
}


.btn-voltar {
  position: absolute;
  left: 0;
  font-family: var(--font-nunito-sans);
  font-size: var(--size-xlarge-2);
  background: none;
  border: none;
  color: var(--color-secondary);
  cursor: pointer;
  padding: 0 calc(var(--padding-default) * 1.125); /* 45px */
}

.btn-voltar:hover {
  color: var(--color-primary);
}

.curso-detalhes {
  display: flex;
  flex-wrap: wrap;
  background-color: rgba(var(--color-dark-rgb), 0.4);
  margin: calc(var(--padding-default) * 0.75); /* 30px */
  padding: calc(var(--padding-default) * 0.375); /* 15px */
  border-radius: 10px;
}

.curso-capa {
  position: relative;
  margin: 0 calc(var(--padding-default) * 0.75) calc(var(--padding-default) * 0.75) 0; /* 30px */
}

.capa-img {
  width: 300px;
  height: auto;
  border-radius: 10px;
}

.curso-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.curso-nome {
  font-family: var(--font-oxygen);
  font-size: var(--size-big-1);
  color: var(--color-primary);
}

.curso-descricao {
  font-family: var(--font-oxygen);
  font-size: var(--size-xlarge-2);
  margin-bottom: 10px;
  font-weight: bold;
}

.btn-adicionar-trilha {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: var(--size-xlarge-2);
  margin-left: 10px;
}


.btn-adicionar-trilha:hover {
  color: var(--color-secondary);
}

.curso-estilo,
.curso-idioma,
.curso-duracao,
.curso-data-inicio {
  font-size: var(--size-large-1);
}

.italico {
  font-style: italic;
}

.curso-acoes {
  display: flex;
  margin-top: 20px;
  gap: 50px;
}

.curso-acao {
  text-align: center;
  cursor: pointer;
  color: var(--color-secondary);
  font-size: var(--size-large-1);
  transition: color 0.3s;
}

.curso-acao i {
  font-size: var(--size-xlarge-2);
  display: block;
}

.curso-acao span {
  display: block;
  margin-top: 5px;
}

.curso-acao:hover {
  color: var(--color-primary);
}

.curso-aulas {
  background-color: rgba(var(--color-dark-rgb), 0.4);
  margin: calc(var(--padding-default) * 0.75); /* 30px */
  padding: calc(var(--padding-default) * 0.375); /* 15px */
  border-radius: 10px;
}

.curso-aulas h2 {
  font-family: var(--font-oxygen);
  font-size: var(--size-xlarge-2);
  color: var(--color-secondary);
  margin-bottom: 15px;
}

.curso-aulas ul {
  list-style: none;
  padding: 0;
  font-size: var(--size-large-1);
}

.curso-aulas li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: rgba(var(--color-secondary-rgb), 0.1);
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  border: 2px solid transparent;
}

.curso-aulas li:hover {
  border: 2px solid var(--color-primary);
}

.curso-aulas li.reproduzida {
  background-color: rgba(var(--color-secondary-rgb), 0.2);
}

.aula-detalhes {
  display: flex;
  align-items: center;
}

.aula-detalhes i {
  margin-right: 10px;
}

.aula-duracao {
  font-size: var(--size-large-1);
  color: var(--color-secondary);
  text-align: right;
}




/* Tablet */
@media (max-width: 768px) {

  .curso-acoes {
    gap: 20px;
  }
}




/* Mobile */
@media (max-width: 480px) {

  .curso-nome {
    display: none;
  }

  .curso-detalhes {
    flex-direction: column;
    align-items: center;
  }

  .curso-capa {
    margin-right: 0;
  }

  .curso-info {
    text-align: center;
  }

  .capa-img {
    width: 100%;
    max-width: 260px;
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
}
</style>