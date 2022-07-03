<script setup>
import {
  ref, onMounted, computed, watch,
} from 'vue';

import PlannerContent from '@/components/layout/PlannerContent.vue';
import EditShift from '@/components/layout/EditShift.vue';
import PlannerCalendar from '@/components/layout/PlannerCalendar.vue';
import PlusMinusHours from '@/components/layout/PlusMinusHours.vue';
import EmptyWeek from '@/components/layout/EmptyWeek.vue';

import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();

const searchInputField = ref();
const searchInput = ref('');
const hideEmptyWeek = ref(false);
const filters = ref({});

const displayRoles = computed(() => {
  if (Object.values(filters.value).includes(true)) {
    return Object.keys(filters.value).filter((role) => filters.value[role] === true);
  }
  return Object.keys(filters.value);
});

const schedulesInView = computed(() => store.getters['planner/schedulesInView']);

const emptyWeek = computed(() => !Object.values(schedulesInView.value).flat().length);

const setWindowTitle = () => {
  const { weekId } = route.params;
  store.dispatch('date/setDates', weekId);
  document.title = `Week ${store.getters['date/weekNumber']} - Planner - Spark`;
};

watch(route, (to) => {
  if (to.name === 'Planner') {
    setWindowTitle();
    hideEmptyWeek.value = false;
  }
});

onMounted(() => {
  setWindowTitle();
  filters.value = store.getters['settings/settings'].roles.reduce((acc, i) => ({ ...acc, [i.toLowerCase()]: false }), {});
});

const clearSearchInput = () => {
  searchInput.value = '';
  searchInputField.value.focus();
};

const addNewShift = () => store.dispatch('planner/addNewShift');

const setFilter = (status) => {
  filters.value[status] = !filters.value[status];
};

const clearFilters = () => {
  Object.keys(filters.value).forEach((key) => {
    filters.value[key] = false;
  });
};

const toggleSidebar = () => {
  store.dispatch('settings/toggleSidebar');
  store.dispatch('settings/sidebarAutoHidden', false);
};

</script>

<template>
  <div class="actionbar">
    <div class="search">
      <input
        ref="searchInputField"
        v-model.trim="searchInput"
        autocomplete="off"
        type="text"
        placeholder="Search Planner"
      >
      <span
        v-if="!searchInput"
        class="material-icons material-icons-round"
      >search</span>
      <span
        v-else
        class="clear material-icons material-icons-round"
        @click="clearSearchInput"
      >clear</span>
    </div>
    <div class="filter">
      {{ $t('general.actions.filter') }}:
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
      >clear</span>
    </div>
    <div class="actions">
      <base-button
        icon="add"
        @click="addNewShift"
      >
        {{ $t('general.actions.add', { resource: 'Shift' }) }}
      </base-button>
      <base-button
        inverted
        icon-only
        :flipped="!$store.getters['settings/hideSidebar']"
        icon="menu_open"
        @click="toggleSidebar"
      />
    </div>
  </div>
  <main>
    <section id="planner">
      <EmptyWeek
        v-if="emptyWeek && !hideEmptyWeek"
        @hide-empty-week="hideEmptyWeek = true"
      />
      <div v-else>
        <div class="header">
          <div>
            <transition name="weekSwitch">
              <WeekSwitch v-if="$store.getters['settings/hideSidebar']" />
            </transition>
          </div>
          <div
            v-for="date in $store.getters['date/dates']"
            :key="date"
            :class="['dayWrapper', { today: date.isSame($dayjs(), 'date') }]"
          >
            <span class="dayName">{{ date.format('dddd') }}</span>
            <span class="date">{{ date.format('LL') }}</span>
          </div>
        </div>
        <PlannerContent
          :schedules="schedulesInView"
          :roles="displayRoles"
          :search="searchInput"
        />
      </div>
    </section>

    <EditShift v-if="$store.getters['planner/activeShiftId']" />

    <the-sidebar>
      <section>
        <PlannerCalendar />
      </section>
      <section
        v-if="!emptyWeek || hideEmptyWeek"
        class="plus-minus-hours"
      >
        <PlusMinusHours
          :roles="displayRoles"
          :search="searchInput"
        />
      </section>
    </the-sidebar>
  </main>
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
