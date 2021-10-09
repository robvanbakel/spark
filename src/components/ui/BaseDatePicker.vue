<template>
  <div class="base-date-picker">
    <div class="input" @click="showCalendar" :class="{ focus: calendarVisible, error }">
      {{ formatDate(activeDate) }}
    </div>
    <base-overlay v-if="calendarVisible" @clickout="hideCalendar" invisible></base-overlay>
    <div class="calendar" v-if="calendarVisible">
      <BaseCalendar mode="picker" :active="activeDate" @choice="setDate" />
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
      activeDate: this.active || null,
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
      return date?.toLocaleDateString(this.$store.getters["settings/dateLocale"], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    },
    setDate(date) {
      this.activeDate = date
      this.hideCalendar()
      this.$emit("date", date)
    },
  },
}
</script>
