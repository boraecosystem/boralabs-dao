import { createRouter, createWebHistory } from 'vue-router';
import Create from '@/pages/Create.vue';
import Detail from '@/pages/Detail.vue';
import Home from '@/pages/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/create',
      name: 'create',
      component: Create
    },
    {
      path: '/proposals/:id',
      name: 'detail',
      component: Detail
    },
    {
      path: '/:pathMatch(.*)',
      name: 'notfound',
      component: () => import('@/components/service/NotFound.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
