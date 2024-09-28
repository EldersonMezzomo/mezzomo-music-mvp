import { createRouter, createWebHistory } from 'vue-router';
import TelaInicio from '@/views/TelaInicio.vue';
import TelaCurso from '@/views/TelaCurso.vue';
import TelaPlayer from '@/views/TelaPlayer.vue';
import TelaQuiz from '@/views/TelaQuiz.vue';
import TelaTrilha from '@/views/TelaTrilha.vue'; 
import TelaBoasVindas from '@/views/TelaBoasVindas.vue';

const routes = [
  {
    path: '/', 
    name: 'BoasVindas', 
    component: TelaBoasVindas
  },
  {
    path: '/inicio', 
    name: 'TelaInicio', 
    component: TelaInicio 
  },
  { 
    path: '/curso/:id', 
    name: 'TelaCurso', 
    component: TelaCurso 
  },
  { 
    path: '/trilha/:id', 
    name: 'TelaTrilha', 
    component: TelaTrilha 
  },
  { 
    path: '/player/:cursoId/:aulaId', 
    name: 'TelaPlayer', 
    component: TelaPlayer 
  },
  { 
    path: '/quiz/:id', 
    name: 'TelaQuiz', 
    component: TelaQuiz 
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;