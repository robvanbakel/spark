import { createRouter, createWebHistory } from 'vue-router';

import { auth } from '@/firebase';
import store from '@/store';

import HomeView from '@/views/HomeView';
import EmployeesView from '@/views/EmployeesView';
import PlannerView from '@/views/PlannerView';
import ScheduleView from '@/views/ScheduleView';
import AuthView from '@/views/AuthView';
import SettingsView from '@/views/SettingsView';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomeView,
      name: 'Home',
    },
    {
      path: '/auth',
      component: AuthView,
      name: 'Auth',
      meta: {
        noAuth: true,
        title: 'Login',
      },
    },
    {
      path: '/staff',
      component: EmployeesView,
      name: 'EmployeeList',
      meta: {
        admin: true,
        title: 'Staff',
      },
    },
    {
      path: '/planner/:weekId?',
      component: PlannerView,
      name: 'Planner',
      meta: {
        admin: true,
      },
      async beforeEnter(to) {
        store.dispatch('date/setDates', to.params.weekId);
      },
    },
    {
      path: '/schedule/:weekId?',
      component: ScheduleView,
      name: 'Schedule',
      async beforeEnter(to) {
        store.dispatch('date/setDates', to.params.weekId);
      },
    },
    {
      path: '/settings',
      component: SettingsView,
      name: 'Settings',
      meta: {
        title: 'Settings',
      },
    },
  ],
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
