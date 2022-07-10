import { createRouter, createWebHistory } from 'vue-router';

import auth from '@/firebase';

import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'Planner') {
    let title = 'Spark';

    if (to.meta.title) {
      title = `${to.meta.title} - ${title}`;
    }

    document.title = title;
  }

  if (!to.meta.noAuth && !auth.currentUser) {
    next({ name: 'Auth' });
    return;
  }

  next();
});

export default router;
