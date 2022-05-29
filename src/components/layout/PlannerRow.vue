<template>
  <div v-if="employee">
    <div v-if="hasschedulesInView" class="row" :class="employee.role?.toLowerCase()">
      <div class="employee">
        <span class="name">{{ employee.firstName }} {{ employee.lastName }}</span>
        <span class="hours">
          <span class="calculated">
            {{ $store.getters['employees/totalHours'][employee.id]?.toFixed(2) }}</span> /
            {{ employee.contract }} hours
          </span>
      </div>
      <ShiftBlock
        v-for="(shift, index) in schedule"
        :key="index"
        :shift="shift"
        @click="handleClick(index)"
      />
    </div>
  </div>
  <div v-else>
    <div>
      <div class="row">
        <div class="employee"></div>
        <ShiftBlock v-for="date in $store.getters['date/dates']" :key="date" />
      </div>
    </div>
  </div>
</template>

<script>
import ShiftBlock from '@/components/layout/ShiftBlock.vue';

export default {
  props: ['employee', 'schedule', 'search'],
  components: { ShiftBlock },
  watch: {
    search(query) {
      this.searchInput = query;
    },
  },
  data() {
    return {
      searchInput: '',
    };
  },
  computed: {
    hasschedulesInView() {
      return this.schedule && !this.schedule?.every((v) => !v);
    },
  },
  methods: {
    handleClick(index) {
      if (this.schedule[index]) {
        this.$store.dispatch('planner/setActiveShiftId', this.schedule[index].id);
      } else {
        this.$store.dispatch('planner/addNewShift', {
          employeeId: this.employee.id,
          from: this.$store.getters['date/dates'][index],
          to: this.$store.getters['date/dates'][index],
        });
      }
    },
  },
};
</script>
