<template>
  <div class="base-date-picker">
    <input
      @click="showCalendar"
      readonly
      :class="{ focus: calendarVisible, error }"
      :value="formatDate(activeDate)"
      @focus="showCalendar"
    />
    <base-overlay v-if="calendarVisible" @clickout="hideCalendar" invisible></base-overlay>
    <div class="calendar" v-if="calendarVisible">
      <BaseCalendar mode="picker" :active="activeDate" @choice="setDate" />
    </div>
  </div>
</template>

<script>
import BaseCalendar from '@/components/ui/BaseCalendar/BaseCalendar.vue';

export default {
  components: { BaseCalendar },
  emits: ['date'],
  props: {
    active: {
      type: Date,
      require: false,
    },
    error: {
      type: Boolean,
      require: false,
    },
  },
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
    formatDate(date) {
      return date?.toLocaleDateString(this.$store.getters['settings/dateNotation'], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
    setDate(date) {
      this.activeDate = date;
      this.hideCalendar();
      this.$emit('date', date);
    },
  },
};
</script>
