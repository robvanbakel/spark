import HomeView from '@/views/HomeView.vue';
import EmployeesView from '@/views/EmployeesView.vue';
import PlannerView from '@/views/PlannerView.vue';
import ScheduleView from '@/views/ScheduleView.vue';
import AuthView from '@/views/AuthView.vue';
import SettingsView from '@/views/SettingsView.vue';
import UserSettings from '@/views/UserSettings.vue';

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
    path: '/staff/:id',
    component: UserSettings,
    name: 'UserSettings',
    meta: {
      admin: true,
      title: 'Settings',
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
