import App from './App.vue';
import router from './router';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import '@/assets/styles.scss';

const app = createApp(App);
const pinia = createPinia();
pinia.use(
  createPersistedState({
    key: (id) => `__persisted__${id}`
  })
);

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin);

app.mount('#app');
