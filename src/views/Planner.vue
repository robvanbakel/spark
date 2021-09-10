<template>
  <div class="actionbar">
    <div class="search">
      <input type="text" v-model.trim="searchInput" placeholder="Search Planner" ref="searchInput" />
      <span v-if="!searchInput" class="material-icons material-icons-round">search</span>
      <span v-else class="clear material-icons material-icons-round" @click="clearSearchInput">clear</span>
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
      <span v-if="Object.values(filters).includes(true)" class="clear material-icons material-icons-round" @click="clearFilters">clear</span>
    </div>
    <base-button @click="addNewShift" icon="add">Add Shift</base-button>
  </div>
  <main v-if="$store.getters['planner/schedules']">
    <section id="planner">
      <div class="header">
        <div></div>
        <div class="dayWrapper" v-for="offset in $store.getters['date/daysVisible']" :key="offset">
          <span class="dayName">{{ $store.getters["date/dayNames"][offset - 1] }}</span>
          <span class="date">{{ $store.getters["date/datesShort"][offset - 1] }}</span>
        </div>
      </div>
      <PlannerContent v-for="role in this.displayRoles" :key="role" :role="role" :search="searchInput" />
    </section>

    <EditShift v-if="$store.getters['planner/activeShiftId']" />

    <the-sidebar>
      <section>
        <PlannerCalendar />
      </section>
    </the-sidebar>
  </main>
</template>

<script>
import PlannerContent from "@/components/layout/PlannerContent";
import EditShift from "@/components/layout/EditShift";
import PlannerCalendar from "@/components/layout/PlannerCalendar";

export default {
  props: ["weekId"],
  components: {
    PlannerContent,
    EditShift,
    PlannerCalendar,
  },
  data() {
    return {
      searchInput: "",
      filters: {
        management: false,
        leadership: false,
        general: false,
        restaurant: false,
        cleaning: false,
      },
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
      this.$store.dispatch("planner/setActiveShiftId", 'new');
    },
    setFilter(status) {
      this.filters[status] = !this.filters[status];
    },
    clearFilters() {
      Object.keys(this.filters).forEach((key) => {
        this.filters[key] = false;
      });
    },
  },
  computed: {
    displayRoles() {
      const roles = ["management", "leadership", "general", "restaurant", "cleaning"];

      if (Object.values(this.filters).includes(true)) {
        return roles.filter((role) => this.filters[role] === true);
      } else {
        return roles;
      }

    },
  },
  watch: {
    $route(to) {
      if (to.name === "Planner") {
        this.$store.dispatch("date/setDates", this.$route.params.weekId);
      }
    },
  },
};
</script>
