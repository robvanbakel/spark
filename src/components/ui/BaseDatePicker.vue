<template>
  <div class="base-date-picker">
    <div class="input" @click="showCalendar" :class="{ focus: calendarVisible, error }">
      {{ input }}
    </div>
    <base-overlay v-if="calendarVisible" @clickout="hideCalendar" invisible></base-overlay>
    <div class="calendar" v-if="calendarVisible">
      <BaseCalendar mode="picker" @choice="setDate" />
    </div>
  </div>
</template>

<script>
import BaseCalendar from "@/components/ui/BaseCalendar"
export default {
  components: { BaseCalendar },
  emits: ["date"],
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
      input: this.formatDate(this.active) || '',
    }
  },
  methods: {
    showCalendar() {
      this.calendarVisible = true
    },
    hideCalendar() {
      this.calendarVisible = false
    },
    formatDate(date) {
      return date?.toLocaleDateString(this.$store.getters['settings/dateLocale'], { year: "numeric", month: "2-digit", day: "2-digit" })
    },
    setDate(date) {
      this.input = this.formatDate(date)
      this.hideCalendar()
      this.$emit('date', date)

    },
  },
}
</script>
