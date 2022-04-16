import { createRouter, createWebHistory } from 'vue-router';

import { auth } from '@/firebase';
import store from '@/store';

import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  let title = 'Spark';

  if (to.meta.title) {
    title = `${to.meta.title} - ${title}`;
  }

  document.title = title;

  if (!to.meta.noAuth && !auth.currentUser) {
    next({ name: 'Auth' });
  } else if (to.meta.admin && !store.getters['auth/admin']) {
    next({ name: 'Schedule' });
  } else {
    next();
  }
});

export default router;
