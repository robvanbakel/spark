import { createApp } from 'vue'

import router from '@/router.js';
import store from '@/store/index.js'
import App from '@/App.vue';

import '@/assets/styles/main.css';

import BaseBadge from "@/components/ui/BaseBadge";
import BaseButton from "@/components/ui/BaseButton";
import BaseSwitch from "@/components/ui/BaseSwitch";
import BaseSelect from "@/components/ui/BaseSelect";
import BaseOverlay from "@/components/ui/BaseOverlay";
import BaseConfirm from "@/components/ui/BaseConfirm";
import TheSidebar from "@/components/layout/TheSidebar";

import { auth } from '@/firebase'

// Get FireBase Auth status before app instantiation

let app = null

auth.onAuthStateChanged((user) => {

  if (user) {
    store.dispatch('auth/getCurrentUser')
    store.dispatch('employees/getEmployees')
    store.dispatch('planner/getSchedules')
    store.dispatch('settings/getSettings')
  }

  if (!app) {

    app = createApp(App);

    app.use(router);
    app.use(store);

    app.component('base-button', BaseButton);
    app.component('base-badge', BaseBadge);
    app.component('base-switch', BaseSwitch);
    app.component('base-select', BaseSelect);
    app.component('base-overlay', BaseOverlay);
    app.component('base-confirm', BaseConfirm);
    app.component('the-sidebar', TheSidebar);

    app.mount('#app')

  }

})
