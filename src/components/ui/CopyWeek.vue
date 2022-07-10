<script setup>
import { ref, onMounted, computed } from 'vue';

import { useStore } from 'vuex';

import { useDate } from '@/pinia';

const dateStore = useDate();

const store = useStore();

const selectedWeek = ref(null);

const weeks = computed(() => Object.keys(store.getters['planner/schedules'])
  .map((weekId) => ({
    id: weekId,
    display: `Week ${Number(weekId.split('-')[1])}`,
  }))
  .reverse());

const selectWeek = (week) => {
  selectedWeek.value = week;
};

const copyWeek = () => {
  store.dispatch('planner/copyWeek', {
    to: dateStore.weekId,
    from: selectedWeek.value,
  });
};

onMounted(() => {
  selectedWeek.value = [weeks];
});
</script>

<template>
  <div class="copy-week-wrapper">
    <base-dropdown
      :items="weeks"
      :active="weeks[0].id"
      @choice="selectWeek"
    />
    <base-button @click="copyWeek">
      Copy
    </base-button>
  </div>
</template>
