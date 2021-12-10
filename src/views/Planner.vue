<template>
  <div class="actionbar">
    <div class="search">
      <input
        autocomplete="off"
        type="text"
        v-model.trim="searchInput"
        placeholder="Search Planner"
        ref="searchInput"
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
      Filter:
      <base-badge
        @click="setFilter(status)"
        v-for="status in Object.keys(filters)"
        :key="status"
        :status="status"
        :class="{ inactive: !filters[status] }"
      ></base-badge>
      <span
        v-if="Object.values(filters).includes(true)"
        class="clear material-icons material-icons-round"
        @click="clearFilters"
        >clear</span
      >
    </div>
    <div class="actions">
      <base-button icon="add" @click="addNewShift">Add Shift</base-button>
      <base-button
        inverted
        iconOnly
        :flipped="!$store.getters['settings/hideSidebar']"
        icon="menu_open"
        @click="toggleSidebar"
      ></base-button>
    </div>
  </div>
  <main v-if="$store.getters['planner/schedules']">
    <section id="planner">
      <EmptyWeek
        v-if="emptyWeek && !hideEmptyWeek"
        @hide-empty-week="hideEmptyWeek = true"
      />
      <div v-else>
        <div class="header">
          <div>
            <transition name="weekSwitch">
              <week-switch v-if="$store.getters['settings/hideSidebar']" />
            </transition>
          </div>
          <div
            v-for="(offset, index) in 7"
            :key="offset"
            :class="[
              'dayWrapper',
              { today: today($store.getters['date/dates'][index]) },
            ]"
          >
            <span class="dayName">{{
              $store.getters["date/dayNames"][index]
            }}</span>
            <span class="date">{{
              $store.getters["date/datesShort"][index]
            }}</span>
          </div>
        </div>
        <PlannerContent :roles="displayRoles" :search="searchInput" />
      </div>
    </section>

    <EditShift v-if="$store.getters['planner/activeShiftId']" />

    <the-sidebar>
      <section>
        <PlannerCalendar />
      </section>
      <section class="plus-minus-hours" v-if="!emptyWeek || hideEmptyWeek">
        <PlusMinusHours :roles="displayRoles" />
      </section>
    </the-sidebar>
  </main>
</template>

<script>
import PlannerContent from "@/components/layout/PlannerContent";
import EditShift from "@/components/layout/EditShift";
import PlannerCalendar from "@/components/layout/PlannerCalendar";
import PlusMinusHours from "@/components/layout/PlusMinusHours";
import EmptyWeek from "@/components/layout/EmptyWeek";

export default {
  props: ["weekId"],
  components: {
    PlannerContent,
    EditShift,
    PlannerCalendar,
    PlusMinusHours,
    EmptyWeek,
  },
  data() {
    return {
      searchInput: "",
      hideEmptyWeek: false,
      filters: {},
    };
  },
  methods: {
    closeEditShift() {
      this.activeShiftId = null;
    },
    clearSearchInput() {
      this.searchInput = "";
      this.$refs.searchInput.focus();
    },
    addNewShift() {
      this.$store.dispatch("planner/setActiveShiftId", "new");
    },
    setFilter(status) {
      this.filters[status] = !this.filters[status];
    },
    clearFilters() {
      Object.keys(this.filters).forEach((key) => (this.filters[key] = false));
    },
    toggleSidebar() {
      this.$store.dispatch("settings/toggleSidebar");
      this.$store.dispatch("settings/sidebarAutoHidden", false);
    },
    today(date) {
      if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
        return true;
      }
    },
  },
  computed: {
    displayRoles() {
      if (Object.values(this.filters).includes(true)) {
        return Object.keys(this.filters).filter(
          (role) => this.filters[role] === true
        );
      } else {
        return Object.keys(this.filters);
      }
    },
    emptyWeek() {
      return !this.$store.getters["planner/currentWeekSchedule"];
    },
  },
  watch: {
    $route(to) {
      if (to.name === "Planner") {
        const weekId = this.$route.params.weekId;
        this.$store.dispatch("date/setDates", weekId);
        this.hideEmptyWeek = false;
        document.title = `Week ${parseInt(
          this.$route.params.weekId.split("-")[1]
        )} - Planner`;
      }
    },
  },
  mounted() {
    this.filters = this.$store.getters["settings/roles"].reduce(
      (filters, role) => ((filters[role.toLowerCase()] = false), filters),
      {}
    );
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
