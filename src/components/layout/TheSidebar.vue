<script setup>
import { computed } from 'vue';

import { useSettings } from '@/store';

const settingsStore = useSettings();

const hidden = computed(() => settingsStore.sidebarHidden);
</script>

<template>
  <aside :class="{ hidden }">
    <slot />
  </aside>
</template>
