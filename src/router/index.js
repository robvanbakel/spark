import { createRouter, createWebHistory } from 'vue-router';

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

  next();
});

export default router;
