<template>
  <div class="letra">
    <h2>Letra da Música</h2>
    <p>{{ letra }}</p>
  </div>
</template>

<script>
export default {
  props: ['letra'] // Remover duplicação
};
</script>

<style scoped>
.letra {
  padding: 20px;
  background-color: #181818;
  color: white;
}
</style>
  