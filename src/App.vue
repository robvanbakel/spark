<script setup>
import { ref, onMounted } from 'vue';

import TheHeader from '@/components/layout/TheHeader.vue';

import { useAuth } from '@/pinia';

import { useStore } from 'vuex';

const authStore = useAuth();

const store = useStore();

const breakpoints = ref({
  sm: {
    width: 960,
    active: false,
  },
  md: {
    width: 1260,
    active: false,
  },
});

const setActiveBreakpoint = (selected) => {
  Object.keys(breakpoints.value).forEach((breakpoint) => {
    breakpoints.value[breakpoint].active = false;
  });
  if (selected) {
    breakpoints.value[selected].active = true;
  }
};

const checkScreenSize = () => {
  if (window.innerWidth < breakpoints.value.sm.width) {
    setActiveBreakpoint('sm');
  } else if (window.innerWidth < breakpoints.value.md.width) {
    setActiveBreakpoint('md');

    if (!store.getters['settings/hideSidebar']) {
      store.dispatch('settings/hideSidebar', true);
      store.dispatch('settings/sidebarAutoHidden', true);
    }
  } else {
    setActiveBreakpoint(null);
    if (store.getters['settings/sidebarAutoHidden']) {
      store.dispatch('settings/hideSidebar', false);
    }
  }
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

</script>

<template>
  <div
    v-if="!breakpoints.sm.active"
    class="container"
  >
    <TheHeader v-if="authStore.user" />
    <router-view />
  </div>
  <div
    v-else
    style="text-align: center; padding: 3em 1em;"
  >
    {{ $t('general.smallScreenWarning') }}
  </div>
</template>
