<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import { useDate, usePlanner } from "@/store";

const dateStore = useDate();
const plannerStore = usePlanner();

const selectedWeek = ref(null);

const weeks = computed(() =>
  Object.keys(plannerStore.schedules)
    .map((weekId) => ({
      id: weekId,
      display: `Week ${Number(weekId.split("-")[1])}`,
    }))
    .reverse()
);

const selectWeek = (week) => {
  selectedWeek.value = week;
};

const copyWeek = () => {
  plannerStore.copyWeek({
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
    <base-dropdown :items="weeks" :active="weeks[0].id" @choice="selectWeek" />
    <base-button @click="copyWeek"> Copy </base-button>
  </div>
</template>
