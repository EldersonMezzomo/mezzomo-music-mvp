<!-- TelaTrilha.vue -->
<template>
  <div class="tela-trilha">
   
    <!-- Botão Voltar -->
    <button class="btn-voltar" @click="voltarTelaInicio">
      <i class="fa-solid fa-arrow-left"></i> Voltar
    </button>

    <h1>Tela Trilha</h1>
    <p>Esta tela está em construção.</p>
  </div>
</template>

<script>
export default {
  name: 'TelaTrilha',
  methods: {
    voltarTelaInicio() {
      this.$router.push({ name: 'TelaInicio' });
    },
  },
};
</script>




<style scoped>
@import "@/assets/css/variables.css";

.tela-trilha {
  background-color: var(--color-dark);
  color: var(--color-primary);
  padding: 45px;
}

.btn-voltar {
  font-family: var(--font-nunito-sans);
  background: none;
  border: none;
  color: var(--color-secondary);
  font-size: var(--size-xlarge-2);
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.btn-voltar:hover {
  color: var(--color-primary);
}

h1,
p {
  text-align: center;
}
</style>