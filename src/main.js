import { createApp } from 'vue';

import router from '@/router';
import store from '@/store';
import App from '@/App.vue';

import '@/assets/styles/main.scss';

import dayjs from '@/plugins/dayjs';
import i18n from '@/plugins/i18n';

import BaseBadge from '@/components/ui/BaseBadge.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseSwitch from '@/components/ui/BaseSwitch.vue';
import BaseOverlay from '@/components/ui/BaseOverlay.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import BaseDropdown from '@/components/ui/BaseDropdown.vue';
import BaseConfirm from '@/components/ui/BaseConfirm.vue';
import BaseDatePicker from '@/components/ui/BaseDatePicker.vue';
import WeekSwitch from '@/components/ui/WeekSwitch.vue';
import TheSidebar from '@/components/layout/TheSidebar.vue';

import { auth } from '@/firebase';

// Sign user out before demo environment is reloaded
if (store.getters['settings/mode'] === 'demo') {
  auth.signOut();
}

// Get Firebase Auth status before app instantiation

let app = null;

auth.onAuthStateChanged(async (user) => {
  if (user) {
    await store.dispatch('settings/getSettings');
    await store.dispatch('employees/getUsers');
    await store.dispatch('planner/getSchedules');
    await store.dispatch('date/setDates');
  }

  if (!app) {
    app = createApp(App);

    app.use(router);
    app.use(store);
    app.use(i18n);

    app.config.globalProperties.$dayjs = dayjs;

    app.component('base-button', BaseButton);
    app.component('base-badge', BaseBadge);
    app.component('base-switch', BaseSwitch);
    app.component('base-overlay', BaseOverlay);
    app.component('base-modal', BaseModal);
    app.component('base-dropdown', BaseDropdown);
    app.component('BaseConfirm', BaseConfirm);
    app.component('BaseDatePicker', BaseDatePicker);
    app.component('WeekSwitch', WeekSwitch);
    app.component('the-sidebar', TheSidebar);

    app.mount('#app');
  }
});
