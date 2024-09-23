import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@/assets/css/variables.css'; /* Importando variáveis globalmente */

createApp(App).use(router).mount('#app');
