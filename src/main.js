import { createApp } from 'vue';

import auth from '@/firebase';
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
import RightClickMenu from '@/components/ui/RightClickMenu.vue';
import TheSidebar from '@/components/layout/TheSidebar.vue';

import { onAuthStateChanged, signOut } from 'firebase/auth';

// Sign user out before demo environment is reloaded
if (store.getters['settings/mode'] === 'demo') {
  signOut(auth);
}

// Get Firebase Auth status before app instantiation

let app = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    await store.dispatch('employees/getUsers');

    if (store.getters['auth/admin']) {
      await store.dispatch('settings/getSettings');
    }

    await store.dispatch('planner/getShifts');
    await store.dispatch('date/setDates');

    router.push({ name: 'EmployeeList' });
  }

  if (!app) {
    app = createApp(App);

    app.use(router);
    app.use(store);
    app.use(i18n);

    app.config.globalProperties.$dayjs = dayjs;

    app.component('BaseButton', BaseButton);
    app.component('BaseBadge', BaseBadge);
    app.component('BaseSwitch', BaseSwitch);
    app.component('BaseOverlay', BaseOverlay);
    app.component('BaseModal', BaseModal);
    app.component('BaseDropdown', BaseDropdown);
    app.component('BaseConfirm', BaseConfirm);
    app.component('BaseDatePicker', BaseDatePicker);
    app.component('WeekSwitch', WeekSwitch);
    app.component('RightClickMenu', RightClickMenu);
    app.component('TheSidebar', TheSidebar);

    app.mount('#app');
  }
});
