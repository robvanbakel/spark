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
      <div class="calendar">
        <div class="colDays">
          <div class="row" v-for="(day, index) in 7" :key="index">
            <span class="dayName"> {{ days[index] }}</span>
            <span class="date">{{ $store.getters["date/datesShort"][index] }}</span>
          </div>
        </div>
        <div class="colCalendar" ref="calendar">
          <div class="hours">
            <span v-for="(hour, index) in 25" :key="index" :style="{ width: `${dayWidth}px`, '--calendarHeight':`${calendarHeight + 12}px` }">{{ index.toString().padStart(2, "0") }}:00</span>
          </div>
          <div class="row " v-for="(day, index) in schedule" :key="index">
            <div
              class="shift"
              v-if="day"
              :style="{ width: `${timeRangeToPercentage(day.start, day.end).percentage}%`, left: `${timeRangeToPercentage(day.start, day.end).startPoint}%` }"
            >
              <span class="place"> {{ day.place }}</span>
              <span class="time">{{ formatTime(day.start) }} - {{ formatTime(day.end) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <base-modal v-if="showQR" @clickout="closeQR">
      <div class="qr-popup">
        <p>Scan this QR code with your phone to add your work schedule to your calendar.</p>
        <img :src="qrCodeImg" alt="Link to calendar subscription" />
        <base-button @click="closeQR">Close</base-button>
      </div>
    </base-modal>

    <the-sidebar>
      <section><PlannerCalendar /></section>
    </the-sidebar>
  </main>
</template>

<script>
import QRCode from "qrcode"

import PlannerCalendar from "@/components/layout/PlannerCalendar"

export default {
  components: { PlannerCalendar },
  data() {
    return {
      qrCodeImg: null,
      calendarWidth: null,
      calendarHeight: null,
      rows: [],
      showQR: false,
    }
  },
  computed: {
    webcalLink() {
      return `webcal://planner.robvanbakel.com/feed/${this.$store.getters["auth/user"].id}`
    },
    days() {
      return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
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
  },
  mounted() {
    this.checkCalendarWidth()
    window.addEventListener("resize", this.checkCalendarWidth)
  },
}
</script>

<style scoped>
.hours span::after {
  height: var(--calendarHeight);
}
</style>
