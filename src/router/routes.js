import { useDate } from '@/store';

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
  },
  {
    path: '/schedule/:weekId?',
    component: ScheduleView,
    name: 'Schedule',
    beforeEnter(to) {
      useDate().setDates(to.params.weekId);
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
