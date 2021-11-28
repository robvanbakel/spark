<template>
  <main v-if="$store.getters['auth/user'] && $store.getters['planner/schedules']">
    <section id="singleEmployeeCalendar">
      <div class="header">
        <h1>Hi {{ $store.getters["auth/user"].firstName }}</h1>
        <div class="actions">
          <base-button @click="openCalendar" icon="calendar_today">Add to Calendar</base-button>
          <base-button class="inverted icon-only" @click="generateQR">
            <span class="clear material-icons material-icons-round">qr_code_2</span>
          </base-button>
        </div>
      </div>
      <div class="calendar" v-if="schedule">
        <div class="colDays">
          <div class="row" v-for="(day, index) in 7" :key="index">
            <span class="dayName"> {{ $store.getters["date/dayNames"][index] }}</span>
            <span class="date">{{ $store.getters["date/datesShort"][index] }}</span>
          </div>
        </div>
        <div class="colCalendar" ref="calendar">
          <div class="hours">
            <span
              v-for="(hour, index) in 25"
              :key="index"
              :style="{ width: `${dayWidth}px`, '--calendarHeight': `${calendarHeight + 12}px` }"
              >{{ index.toString().padStart(2, "0") }}:00</span
            >
          </div>
          <div class="row " v-for="(day, index) in schedule" :key="index">
            <div
              class="shift"
              v-if="day"
              :style="{
                width: `${timeRangeToPercentage(day.start, day.end).percentage}%`,
                left: `${timeRangeToPercentage(day.start, day.end).startPoint}%`,
              }"
              @click="setActiveShift(day, index)"
            >
              <span class="place"> {{ day.place }}</span>
              <span class="time">{{ formatTime(day.start) }} - {{ formatTime(day.end) }}</span>
              <span class="notes material-icons material-icons-round" v-if="day.notes">description</span>
            </div>
          </div>
        </div>
      </div>
      <div class="empty-schedule" v-else>
        <p>No schedule available for week {{ $store.getters["date/weekNumber"] }}.</p>
      </div>
    </section>

    <base-modal
      class="schedule-shift-info"
      v-if="activeShift"
      title="Shift info"
      globalClose
      clickout
      @close="closeActiveShift"
    >
      <template v-slot:main>
        <div class="shift-info-group">
          <span class="label">Date</span>
          <span class="value">{{ activeShift.date }}</span>
        </div>
        <div class="shift-info-group">
          <span class="label">Place</span>
          <span class="value">{{ activeShift.place }}</span>
        </div>
        <div class="shift-info-group">
          <span class="label">Time</span>
          <span class="value">{{ formatTime(activeShift.start) }} - {{ formatTime(activeShift.end) }}</span>
        </div>
        <div class="shift-info-group">
          <span class="label">Duration</span>
          <span class="value">{{ activeShift.duration }} hours ({{ activeShift.break }} minutes break)</span>
        </div>
        <div class="shift-info-group" v-if="activeShift.notes">
          <span class="label">Notes</span>
          <span class="value">{{ activeShift.notes }}</span>
        </div>
      </template>
      <template v-slot:actions>
        <base-button inverted @click="helpActiveShift">Help</base-button>
        <base-button @click="closeActiveShift">Close</base-button>
      </template>
    </base-modal>

    <base-modal v-if="showQR" noHeader class="schedule-qr" clickout @close="closeQR">
      <template v-slot:main>
        <p>Scan with your phone to add your work schedule to your calendar.</p>
        <img :src="qrCodeImg" alt="Link to calendar subscription" />
      </template>
      <template v-slot:actions>
        <base-button @click="closeQR">Close</base-button>
      </template>
    </base-modal>

    <the-sidebar>
      <section><PlannerCalendar /></section>
      <section><EmployeeInfo /></section>
      
    </the-sidebar>
  </main>
</template>

<script>
import QRCode from "qrcode"

import PlannerCalendar from "@/components/layout/PlannerCalendar"
import EmployeeInfo from "@/components/layout/EmployeeInfo"

export default {
  components: { PlannerCalendar,EmployeeInfo },
  data() {
    return {
      qrCodeImg: null,
      calendarWidth: null,
      calendarHeight: null,
      rows: [],
      showQR: false,
      activeShift: null,
    }
  },
  computed: {
    webcalLink() {
      return `webcal://app.sparkscheduler.com/feed/${this.$store.getters["auth/user"].id}`
    },
    schedule() {
      const schedules = this.$store.getters["planner/schedules"]
      const weekId = this.$store.getters["date/weekId"]

      return schedules[weekId]
    },
    showRange() {
      const schedule = this.$store.getters["planner/schedules"][this.$store.getters["date/weekId"]]

      if (!schedule) {
        return {
          showStart: "0800",
          showEnd: "1800",
        }
      }

      const startTimes = schedule.map((day) => day?.start).filter((item) => item)
      const showStart = Math.min(...startTimes)
        .toString()
        .padStart(4, "0")

      const endTmes = schedule.map((day) => day?.end).filter((item) => item)
      const showEnd = Math.max(...endTmes)
        .toString()
        .padStart(4, "0")

      return { showStart, showEnd }
    },
    dayWidth() {
      const { showStart, showEnd } = this.showRange

      // Destructure input
      const startHour = showStart.substring(0, 2)
      const startMin = showStart.substring(2, 4)
      const endHour = showEnd.substring(0, 2)
      const endMin = showEnd.substring(2, 4)

      // Calculate amount of hours and minutes
      const hours = endHour - startHour
      const mins = endMin - startMin

      const minFraction = mins / 60

      let range = hours + minFraction

      range = 24

      return this.calendarWidth / range
    },
    startOffset() {
      const { showStart } = this.showRange

      // Destructure input
      const startHour = showStart.substring(0, 2)
      const startMin = showStart.substring(2, 4)

      // Calculate starting point
      const startHourPercentage = parseInt(startHour)
      const startMinPercentage = startMin / 60
      const startPoint = startHourPercentage + startMinPercentage

      return -startPoint * this.dayWidth
    },
    hideSidebar() {
      return this.$store.getters["settings/hideSidebar"]
    },
  },
  watch: {
    $route(to) {
      if (to.name === "Schedule") {
        const weekId = this.$route.params.weekId
        this.$store.dispatch("date/setDates", weekId)
        this.hideEmptyWeek = false
        document.title = `Week ${parseInt(this.$route.params.weekId.split("-")[1])} - Planner`
      }
    },
    hideSidebar() {
      setTimeout(() => {
        this.checkCalendarWidth()
      }, 260) // Wait for CSS animation to finish
    },
  },
  methods: {
    async generateQR() {
      this.qrCodeImg = await QRCode.toDataURL(this.webcalLink)
      this.showQR = true
    },
    closeQR() {
      this.showQR = false
    },
    openCalendar() {
      location.replace(this.webcalLink)
    },
    formatTime(time) {
      return time.substring(0, 2) + ":" + time.substring(2, 4)
    },
    checkCalendarWidth() {
      this.calendarWidth = this.$refs.calendar?.clientWidth
      this.calendarHeight = this.$refs.calendar?.clientHeight
    },
    timeRangeToPercentage(start, end) {
      // Destructure input
      const startHour = start.substring(0, 2)
      const startMin = start.substring(2, 4)
      const endHour = end.substring(0, 2)
      const endMin = end.substring(2, 4)

      // Calculate amount of hours and minutes
      const hours = endHour - startHour
      const mins = endMin - startMin

      // Calculate percentages
      const hoursPercentage = hours * 100
      const minsPercentage = (mins / 60) * 100

      let percentage = (hoursPercentage + minsPercentage) / 24

      // Calculate starting point
      const startHourPercentage = startHour * 100
      const startMinPercentage = (startMin / 60) * 100
      let startPoint = (startHourPercentage + startMinPercentage) / 24

      return { startPoint, percentage }
    },
    setActiveShift(shift, index) {
      // Helper functions

      const calculateShiftDuration = (shift) => {
        let total = 0

        const [startHours, startMinutes] = shift.start.match(/\d{2}/g)
        const [endHours, endMinutes] = shift.end.match(/\d{2}/g)

        const start = new Date(0)
        start.setHours(startHours)
        start.setMinutes(startMinutes)

        const end = new Date(0)
        end.setHours(endHours)
        end.setMinutes(endMinutes)

        const totalHours = Math.abs(start - end)

        total += totalHours / 1000 / 60 / 60
        total -= shift.break / 60

        return total.toFixed(2)
      }

      // Construct object
      this.activeShift = {
        date: this.$store.getters["date/dates"][index].toLocaleDateString(this.$store.getters["settings/dateLocale"], {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        dateShort: this.$store.getters["date/dates"][index].toLocaleDateString(
          this.$store.getters["settings/dateLocale"]
        ),
        place: shift.place,
        start: shift.start,
        end: shift.end,
        duration: calculateShiftDuration(shift),
        break: shift.break,
      }

      if (shift.notes) {
        this.activeShift.notes = shift.notes
      }
    },
    closeActiveShift() {
      this.activeShift = null
    },
    helpActiveShift() {
      const to = "planner@company.com"
      const subject = `${this.activeShift.dateShort}: Question about my shift (${this.activeShift.place})`

      window.open(`mailto:${to}?subject=${subject}`)
    },
  },
  mounted() {
    this.checkCalendarWidth()
    window.addEventListener("resize", this.checkCalendarWidth)
  },
  updated() {
    this.checkCalendarWidth()
  },
}
</script>

<style scoped>
.hours span::after {
  height: var(--calendarHeight);
}
</style>
