<script setup lang=ts>
import { ref, computed, watch } from "vue";

import CopyWeek from "@/components/ui/CopyWeek.vue";

import { useRoute } from "vue-router";

import { useDate } from "@/store";

const dateStore = useDate();

const route = useRoute();

const emit = defineEmits(["hideEmptyWeek"]);

const showCopyWeek = ref(false);

const dateRange = computed(() => {
  // eslint-disable-next-line prefer-destructuring
  const dates = dateStore.dates;
  return `${dates[0].format("LL")} – ${dates[dates.length - 1].format("LL")}`;
});

watch(route, (to) => {
  if (to.name === "Planner") {
    showCopyWeek.value = false;
  }
});
</script>

<template>
  <div class="empty-week">
    <WeekSwitch />
    <h5>{{ dateRange }}</h5>
    <p>
      No planning has been made for this week yet!<br />
      You can either start with an empty schedule or copy an existing week.
    </p>
    <div class="action-wrapper">
      <div :class="['action', { transparent: showCopyWeek }]" @click="emit('hideEmptyWeek')">
        <span class="material-icons material-icons-round">calendar_today</span>
        Create empty schedule
      </div>
      <CopyWeek v-if="showCopyWeek" />
      <div v-else class="action transparent" style="pointer-events: none">
        <span class="material-icons material-icons-round">event_note</span> Copy an existing week
      </div>
    </div>
  </div>
</template>
