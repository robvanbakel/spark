import store from '@/store';

import dayjs from '@/plugins/dayjs';

import HomeView from '@/views/HomeView.vue';
import EmployeesView from '@/views/EmployeesView.vue';
import PlannerView from '@/views/PlannerView.vue';
import ScheduleView from '@/views/ScheduleView.vue';
import AuthView from '@/views/AuthView.vue';
import SettingsView from '@/views/SettingsView.vue';

export default [
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
    async beforeEnter(to, from, next) {
      if (!to.params.weekId) {
        next({ name: 'Planner', params: { weekId: dayjs().weekId() } });
        return;
      }
      next();
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
];
