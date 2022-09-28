<script setup>
import { ref, computed, watch } from "vue";

import dayjs from "@/plugins/dayjs";

import PlannerContent from "@/components/layout/PlannerContent.vue";
import EditShift from "@/components/layout/EditShift.vue";
import PlannerCalendar from "@/components/layout/PlannerCalendar.vue";
import PlusMinusHours from "@/components/layout/PlusMinusHours.vue";
import EmptyWeek from "@/components/layout/EmptyWeek.vue";

import { useRoute } from "vue-router";

import { useDate, useSettings, usePlanner } from "@/store";

const dateStore = useDate();
const settingsStore = useSettings();
const plannerStore = usePlanner();

const route = useRoute();

const searchInputField = ref();
const searchInput = ref("");
const hideEmptyWeek = ref(false);
const filters = ref({});

const displayRoles = computed(() => {
  if (Object.values(filters.value).includes(true)) {
    return Object.keys(filters.value).filter(
      (role) => filters.value[role] === true
    );
  }
  return Object.keys(filters.value);
});

const schedulesInView = computed(() => plannerStore.schedulesInView);

const emptyWeek = computed(
  () => !Object.values(schedulesInView.value).flat().length
);

const setWindowTitle = () => {
  dateStore.setDates(route.params.weekId || dayjs().weekId());
  document.title = `Week ${dateStore.weekNumber} - Planner - Spark`;
};

watch(route, (to) => {
  if (to.name === "Planner") {
    setWindowTitle();
    hideEmptyWeek.value = false;
  }
});

setWindowTitle();
filters.value = settingsStore.settings.roles.reduce(
  (acc, i) => ({ ...acc, [i.toLowerCase()]: false }),
  {}
);

const clearSearchInput = () => {
  searchInput.value = "";
  searchInputField.value.focus();
};

const setFilter = (status) => {
  filters.value[status] = !filters.value[status];
};

const clearFilters = () => {
  Object.keys(filters.value).forEach((key) => {
    filters.value[key] = false;
  });
};

const toggleSidebar = () => {
  settingsStore.toggleSidebar();
  settingsStore.sidebarAutoHidden = false;
};
</script>

<template>
  <base-layout id="planner">
    <template #actionbar>
      <div class="actionbar">
        <div class="search">
          <input
            ref="searchInputField"
            v-model.trim="searchInput"
            autocomplete="off"
            type="text"
            placeholder="Search Planner"
          />
          <span v-if="!searchInput" class="material-icons material-icons-round"
            >search</span
          >
          <span
            v-else
            class="clear material-icons material-icons-round"
            @click="clearSearchInput"
            >clear</span
          >
        </div>
        <div class="filter">
          {{ $t("general.actions.filter") }}:
          <base-badge
            v-for="status in Object.keys(filters)"
            :key="status"
            :status="status"
            :class="{ inactive: !filters[status] }"
            @click="setFilter(status)"
          />
          <span
            v-if="Object.values(filters).includes(true)"
            class="clear material-icons material-icons-round"
            @click="clearFilters"
            >clear</span
          >
        </div>
        <div class="actions">
          <base-button icon="add" @click="plannerStore.addNewShift">
            {{ $t("general.actions.add", { resource: "Shift" }) }}
          </base-button>
          <base-button
            inverted
            icon-only
            :flipped="!settingsStore.sidebarHidden"
            icon="menu_open"
            @click="toggleSidebar"
          />
        </div>
      </div>
    </template>
    <EmptyWeek
      v-if="emptyWeek && !hideEmptyWeek"
      @hide-empty-week="hideEmptyWeek = true"
    />
    <div v-else>
      <div class="header">
        <div>
          <transition name="weekSwitch">
            <WeekSwitch v-if="settingsStore.sidebarHidden" />
          </transition>
        </div>
        <div
          v-for="date in dateStore.dates"
          :key="date"
          :class="['dayWrapper', { today: date.isSame(dayjs(), 'date') }]"
        >
          <span class="dayName">{{ date.format("dddd") }}</span>
          <span class="date">{{ date.format("LL") }}</span>
        </div>
      </div>
      <PlannerContent
        :schedules="schedulesInView"
        :roles="displayRoles"
        :search="searchInput"
      />
    </div>

    <template #sidebar>
      <section>
        <PlannerCalendar />
      </section>
      <section v-if="!emptyWeek || hideEmptyWeek" class="plus-minus-hours">
        <PlusMinusHours :roles="displayRoles" :search="searchInput" />
      </section>
    </template>
  </base-layout>

  <EditShift v-if="plannerStore.activeShiftId" />
</template>

<style scoped>
.weekSwitch-enter-from,
.weekSwitch-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.weekSwitch-enter-active {
  transition: all 200ms ease-out;
}
.weekSwitch-leave-active {
  transition: all 200ms ease-in;
}
</style>
