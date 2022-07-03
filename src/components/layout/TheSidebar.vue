<script setup>
import { computed } from 'vue';

import { useStore } from 'vuex';

const store = useStore();

const hidden = computed(() => store.getters['settings/hideSidebar']);
</script>

<template>
  <aside :class="{ hidden }">
    <slot />
  </aside>
</template>
