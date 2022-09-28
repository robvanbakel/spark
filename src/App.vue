<script setup>
import { ref } from "vue";

import TheHeader from "@/components/layout/TheHeader.vue";

import { useAuth, useSettings } from "@/store";

const authStore = useAuth();
const settingsStore = useSettings();

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
    setActiveBreakpoint("sm");
  } else if (window.innerWidth < breakpoints.value.md.width) {
    setActiveBreakpoint("md");

    if (!settingsStore.sidebarHidden) {
      settingsStore.sidebarHidden = true;
      settingsStore.sidebarAutoHidden = true;
    }
  } else {
    setActiveBreakpoint(null);
    if (settingsStore.sidebarAutoHidden) {
      settingsStore.sidebarHidden = false;
    }
  }
};

checkScreenSize();
window.addEventListener("resize", checkScreenSize);
</script>

<template>
  <div v-if="settingsStore.isLoaded">
    <div v-if="!breakpoints.sm.active" class="container">
      <TheHeader v-if="authStore.user" />
      <router-view />
    </div>
    <div v-else style="text-align: center; padding: 3em 1em">
      {{ $t("general.smallScreenWarning") }}
    </div>
  </div>
</template>
