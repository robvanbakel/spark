<template>
  <div class="actionbar">
    <div class="search">
      <input
        ref="searchInput"
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

<script>
import PlannerContent from '@/components/layout/PlannerContent.vue';
import EditShift from '@/components/layout/EditShift.vue';
import PlannerCalendar from '@/components/layout/PlannerCalendar.vue';
import PlusMinusHours from '@/components/layout/PlusMinusHours.vue';
import EmptyWeek from '@/components/layout/EmptyWeek.vue';

export default {
  components: {
    PlannerContent,
    EditShift,
    PlannerCalendar,
    PlusMinusHours,
    EmptyWeek,
  },
  data() {
    return {
      searchInput: '',
      hideEmptyWeek: false,
      filters: {},
    };
  },
  computed: {
    displayRoles() {
      if (Object.values(this.filters).includes(true)) {
        return Object.keys(this.filters).filter((role) => this.filters[role] === true);
      }
      return Object.keys(this.filters);
    },
    emptyWeek() {
      return !Object.values(this.schedulesInView).flat().length;
    },
    schedulesInView() {
      return this.$store.getters['planner/schedulesInView'];
    },
  },
  watch: {
    $route(to) {
      if (to.name === 'Planner') {
        this.setWindowTitle();
        this.hideEmptyWeek = false;
      }
    },
  },
  mounted() {
    this.setWindowTitle();
    this.filters = this.$store.getters['settings/settings'].roles.reduce((acc, curr) => ({ ...acc, [curr.toLowerCase()]: false }), {});
  },
  methods: {
    closeEditShift() {
      this.activeShiftId = null;
    },
    clearSearchInput() {
      this.searchInput = '';
      this.$refs.searchInput.focus();
    },
    addNewShift() {
      this.$store.dispatch('planner/addNewShift');
    },
    setFilter(status) {
      this.filters[status] = !this.filters[status];
    },
    clearFilters() {
      Object.keys(this.filters).forEach((key) => {
        this.filters[key] = false;
      });
    },
    toggleSidebar() {
      this.$store.dispatch('settings/toggleSidebar');
      this.$store.dispatch('settings/sidebarAutoHidden', false);
    },
    setWindowTitle() {
      const { weekId } = this.$route.params;
      this.$store.dispatch('date/setDates', weekId);
      document.title = `Week ${this.$store.getters['date/weekNumber']} - Planner - Spark`;
    },
  },
};
</script>

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
