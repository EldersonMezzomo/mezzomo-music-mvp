import { createRouter, createWebHistory } from 'vue-router';
import TelaInicio from './components/TelaInicio.vue';
import TelaCurso from './components/TelaCurso.vue';
import TelaPlayer from './components/TelaPlayer.vue';

const routes = [
  { path: '/', component: TelaInicio },
  { path: '/curso/:curso', component: TelaCurso },
  { path: '/player', component: TelaPlayer }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
