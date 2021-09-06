import { createRouter, createWebHistory } from 'vue-router';

import { auth } from '@/firebase'
import store from '@/store'

import Home from '@/views/Home';
import EmployeeList from '@/views/EmployeeList';
import Planner from '@/views/Planner';
import Employee from '@/views/Employee';
import Auth from '@/views/Auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
      name: 'Home',
    },
    {
      path: '/auth',
      component: Auth,
      name: 'Auth',
      meta: { noAuth: true }
    },
    {
      path: '/staff',
      component: EmployeeList,
      name: 'EmployeeList',
    },
    {
      path: '/planner/:weekId?',
      component: Planner,
      name: 'Planner',
      async beforeEnter(to) {
        const weekId = to.params.weekId || store.getters["date/weekId"] || await store.dispatch("date/getWeekId");
        store.dispatch("date/setDates", weekId);
      }
    },
    {
      path: '/employee',
      component: Employee,
      name: 'Employee',
    },
  ],
});

router.beforeEach((to, from, next) => {

  if (!to.meta.noAuth && !auth.currentUser) {
    next({ name: 'Auth' })
  } else {
    next()
  }

});

export default router