<template>
  <div class="base-date-picker">
    <input
      readonly
      :class="{ focus: calendarVisible, error }"
      :value="activeDate?.format($store.getters['settings/settings'].dateNotation)"
      @click="showCalendar"
      @focus="showCalendar"
      @keydown.tab="hideCalendar"
    >
    <base-overlay
      v-if="calendarVisible"
      invisible
      @clickout="hideCalendar"
    />
    <div
      v-if="calendarVisible"
      class="calendar"
    >
      <BaseCalendar
        mode="picker"
        :active="activeDate"
        @choice="setDate"
      />
    </div>
  </div>
</template>

<script>
import BaseCalendar from '@/components/ui/BaseCalendar/BaseCalendar.vue';

export default {
  components: { BaseCalendar },
  props: {
    active: {
      type: Object,
      require: false,
    },
    error: {
      type: Boolean,
      require: false,
    },
  },
  emits: ['date'],
  data() {
    return {
      calendarVisible: false,
      activeDate: this.active || null,
    };
  },
  methods: {
    showCalendar() {
      this.calendarVisible = true;
      window.addEventListener('keydown', this.keyDownHandler);
    },
    hideCalendar() {
      this.calendarVisible = false;
      window.removeEventListener('keydown', this.keyDownHandler);
    },
    keyDownHandler(e) {
      switch (e.key) {
        case 'Escape':
          this.hideCalendar();
          break;
        default:
          break;
      }
    },
    setDate(date) {
      this.activeDate = date;
      this.hideCalendar();
      this.$emit('date', date);
    },
  },
};
</script>
