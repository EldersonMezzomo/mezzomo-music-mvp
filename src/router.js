import { createRouter, createWebHistory } from 'vue-router';
import TelaInicio from '@/views/TelaInicio.vue';
import TelaCurso from '@/views/TelaCurso.vue';
import TelaLetra from '@/views/TelaLetra.vue';
import TelaPlayer from '@/views/TelaPlayer.vue';
import TelaQuiz from '@/views/TelaQuiz.vue';
import TelaTrilha from '@/views/TelaTrilha.vue'; // Importe a TelaTrilha se existir

const routes = [
  { path: '/', name: 'TelaInicio', component: TelaInicio },
  { path: '/curso/:id', name: 'TelaCurso', component: TelaCurso },
  { path: '/trilha/:id', name: 'TelaTrilha', component: TelaTrilha },
  { path: '/player/:cursoId/:aulaId', name: 'TelaPlayer', component: TelaPlayer,
    children: [ { path: 'letra', name: 'TelaLetra', component: TelaLetra, }, ], },
  { path: '/quiz/:id', name: 'TelaQuiz', component: TelaQuiz },
];



const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
