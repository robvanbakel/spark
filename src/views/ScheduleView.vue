<template>
  <main v-if="$store.getters['auth/user'] && $store.getters['planner/shifts']">
    <section id="singleEmployeeCalendar">
      <div class="header">
        <h1>Hi {{ $store.getters["auth/user"].firstName }}</h1>
        <div
          v-if="schedulesInView"
          class="week-info"
        >
          <div>
            Week: <span>{{ $store.getters["date/weekNumber"] }}</span>
          </div>
          <div>
            Scheduled: <span>{{ workingDays }} days</span>
          </div>
          <div>
            Total: <span>{{ totalHours }} hours</span>
          </div>
        </div>
        <div
          v-if="hasUnacceptedShifts"
          class="actions"
        >
          <base-button
            icon="check"
            @click="acceptAllShifts"
          >
            Accept all shifts
          </base-button>
        </div>
        <div
          v-else
          class="actions"
        >
          <base-button
            icon="calendar_today"
            @click="openCalendar"
          >
            Add to Calendar
          </base-button>
          <base-button
            class="inverted icon-only"
            @click="generateQR"
          >
            <span class="clear material-icons material-icons-round">qr_code_2</span>
          </base-button>
        </div>
      </div>
      <div
        v-if="schedulesInView"
        class="calendar"
      >
        <div class="colDays">
          <div
            v-for="date in $store.getters['date/dates']"
            :key="date"
            class="row"
            :class="{ today: date.isSame($dayjs(), 'date') }"
          >
            <span class="dayName">{{ date.format('dddd') }}</span>
            <span class="date">{{ date.format('LL') }}</span>
          </div>
        </div>
        <div
          ref="calendar"
          class="colCalendar"
        >
          <div class="hours">
            <span
              v-for="(hour, index) in hoursVisible + 1"
              :key="index"
              :style="{
                width: `${dayWidth}px`,
                '--calendarHeight': `${calendarHeight + 12}px`,
              }"
            >{{ $dayjs().hour(index + visibleHoursStart).minute(0).format('HH:mm') }}</span>
          </div>
          <div
            v-for="(day, index) in schedulesInView"
            :key="index"
            class="row"
          >
            <div
              v-if="day"
              class="shift"
              :style="{
                width: `${timeRangeToPercentage(day.from, day.to).percentage}%`,
                left: `${timeRangeToPercentage(day.from, day.to).startPoint}%`,
              }"
              :class="{proposed: day && day.status !== 'ACCEPTED'}"
              @click="setActiveShift(day, index)"
            >
              <span class="location"> {{ day.location }}</span>
              <span class="time">{{ day.from.format('HH:mm') }} - {{ day.to.format('HH:mm') }}</span>
              <span
                v-if="day.notes"
                class="notes material-icons material-icons-round"
              >description</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="empty-schedule"
      >
        <p>
          No schedule available for week
          {{ $store.getters["date/weekNumber"] }}.
        </p>
      </div>
    </section>

    <base-modal
      v-if="activeShift"
      class="schedule-shift-info"
      title="Shift info"
      global-close
      clickout
      @close="closeActiveShift"
    >
      <template #main>
        <div class="shift-info-group">
          <span class="label">Date</span>
          <span class="value">{{ activeShift.date }}</span>
        </div>
        <div class="shift-info-group">
          <span class="label">Location</span>
          <span class="value">{{ activeShift.location }}</span>
        </div>
        <div class="shift-info-group">
          <span class="label">Time</span>
          <span class="value">{{ activeShift.from.format('HH:mm') }} - {{ activeShift.to.format('HH:mm') }}</span>
        </div>
        <div class="shift-info-group">
          <span class="label">Duration</span>
          <span class="value">{{ activeShift.duration }} hours ({{ activeShift.break }} minutes break)</span>
        </div>
        <div
          v-if="activeShift.notes"
          class="shift-info-group"
        >
          <span class="label">Notes</span>
          <span class="value">{{ activeShift.notes }}</span>
        </div>
      </template>
      <template
        v-if="activeShift.status !== 'ACCEPTED'"
        #actions
      >
        <base-button
          icon="close"
          inverted
          @click="reactToProposal(false)"
        >
          Decline
        </base-button>
        <base-button
          icon="check"
          @click="reactToProposal(true)"
        >
          Accept
        </base-button>
      </template>
      <template
        v-else
        #actions
      >
        <base-button
          inverted
          @click="helpActiveShift"
        >
          Help
        </base-button>
        <base-button @click="closeActiveShift">
          Close
        </base-button>
      </template>
    </base-modal>

    <base-modal
      v-if="showQR"
      no-header
      class="schedule-qr"
      clickout
      @close="closeQR"
    >
      <template #main>
        <p>Scan with your phone to add your work schedule to your calendar.</p>
        <img
          :src="qrCodeImg"
          alt="Link to calendar subscription"
        >
      </template>
      <template #actions>
        <base-button @click="closeQR">
          Close
        </base-button>
      </template>
    </base-modal>

    <BaseConfirm
      ref="confirmAcceptAllShifts"
      title="Accept all shifts for this week"
      message="Are you sure you want to accept all shifts for this week?"
      choice-true="Accept shifts"
    />

    <the-sidebar>
      <section><PlannerCalendar /></section>
      <section><EmployeeInfo /></section>
    </the-sidebar>
  </main>
</template>

<script>
import QRCode from 'qrcode';

import PlannerCalendar from '@/components/layout/PlannerCalendar.vue';
import EmployeeInfo from '@/components/layout/EmployeeInfo.vue';

export default {
  components: { PlannerCalendar, EmployeeInfo },
  data() {
    return {
      qrCodeImg: null,
      calendarWidth: null,
      calendarHeight: null,
      rows: [],
      showQR: false,
      activeShift: null,
      visibleHoursStart: 0,
      visibleHoursEnd: 0,
    };
  },
  computed: {
    webcalLink() {
      return `webcal://app.sparkscheduler.com/feed/${this.$store.getters['auth/user'].feedToken}`;
    },
    schedulesInView() {
      const shiftsInView = this.$store.getters['date/dates']
        .map((date) => this.$store.getters['planner/shifts']
          .find((shift) => shift.employeeId === this.$store.getters['auth/user'].id && date.isSame(shift.from, 'date')));

      if (shiftsInView.every((v) => !v)) return null;

      return shiftsInView;
    },
    totalHours() {
      return this.schedulesInView.reduce((acc, shift) => {
        if (!shift) return acc;
        const shiftDuration = this.$dayjs.duration(shift.to.diff(shift.from)).subtract(shift.break, 'minutes');
        return acc + shiftDuration.asHours();
      }, 0);
    },
    workingDays() {
      return this.schedulesInView.filter((v) => v).length;
    },
    hasUnacceptedShifts() {
      return this.schedulesInView?.map((shift) => shift && shift.status === 'ACCEPTED').some((accepted) => accepted === false);
    },
    hoursVisible() {
      return (this.visibleHoursEnd || 24) - this.visibleHoursStart;
    },
    dayWidth() {
      return this.calendarWidth / this.hoursVisible;
    },
    startOffset() {
      return this.visibleHoursStart * this.dayWidth;
    },
    hideSidebar() {
      return this.$store.getters['settings/hideSidebar'];
    },
  },
  watch: {
    $route(to) {
      if (to.name === 'Schedule') {
        const { weekId } = this.$route.params;
        this.$store.dispatch('date/setDates', weekId);
        this.hideEmptyWeek = false;
        document.title = `Week ${this.$store.getters['date/weekNumber']} - Planner`;
      }
    },
    hideSidebar() {
      setTimeout(() => {
        this.checkCalendarWidth();
      }, 280); // Wait for CSS animation to finish
    },
  },
  mounted() {
    this.checkCalendarWidth();
    window.addEventListener('resize', this.checkCalendarWidth);
  },
  unmounted() {
    window.removeEventListener('resize', this.checkCalendarWidth);
  },
  updated() {
    if (this.calendarWidth && this.calendarWidth) return;
    this.checkCalendarWidth();
  },
  methods: {
    async generateQR() {
      this.qrCodeImg = await QRCode.toDataURL(this.webcalLink);
      this.showQR = true;
    },
    closeQR() {
      this.showQR = false;
    },
    openCalendar() {
      window.location.replace(this.webcalLink);
    },
    checkCalendarWidth() {
      this.calendarWidth = this.$refs.calendar?.clientWidth;
      this.calendarHeight = this.$refs.calendar?.clientHeight;
    },
    timeRangeToPercentage(from, to) {
      // Destructure input
      const startHour = from.hour();
      const startMin = from.minute();
      const endHour = to.hour();
      const endMin = to.minute();

      // Calculate amount of hours and minutes
      const hours = endHour - startHour;
      const mins = endMin - startMin;

      // Calculate percentages
      const hoursPercentage = hours * 100;
      const minsPercentage = (mins / 60) * 100;

      const percentage = (hoursPercentage + minsPercentage) / this.hoursVisible;

      // Calculate starting point
      const startHourPercentage = (startHour - this.visibleHoursStart) * 100;
      const startMinPercentage = (startMin / 60) * 100;
      const startPoint = (startHourPercentage + startMinPercentage) / this.hoursVisible;

      return { startPoint, percentage };
    },
    setActiveShift(shift, index) {
      // Helper functions

      const calculateShiftDuration = (selectedShift) => {
        const shiftDuration = this.$dayjs.duration(selectedShift.to.diff(selectedShift.from)).subtract(selectedShift.break, 'minutes');
        return shiftDuration.asHours();
      };

      // Construct object
      this.activeShift = {
        date: this.$store.getters['date/dates'][index].format('dddd LL'),
        dateShort: this.$store.getters['date/dates'][index].format('L'),
        location: shift.location,
        from: shift.from,
        to: shift.to,
        duration: calculateShiftDuration(shift),
        break: shift.break,
        status: shift.status,
        id: shift.id,
      };

      if (shift.notes) {
        this.activeShift.notes = shift.notes;
      }
    },
    async acceptAllShifts() {
      if (await this.$refs.confirmAcceptAllShifts.open()) {
        const nonAcceptedShiftIds = this.schedulesInView.map((shift) => shift && shift.status !== 'ACCEPTED' && shift.id).filter((v) => v);
        this.$store.dispatch('planner/acceptShifts', nonAcceptedShiftIds);
      }
    },
    reactToProposal(accepted) {
      if (accepted) {
        this.$store.dispatch('planner/acceptShifts', [this.activeShift.id]);
      }

      this.closeActiveShift();
    },
    closeActiveShift() {
      this.activeShift = null;
    },
    helpActiveShift() {
      const to = 'planner@company.com';
      const subject = `${this.activeShift.dateShort}: Question about my shift (${this.activeShift.location})`;

      window.open(`mailto:${to}?subject=${subject}`);
    },
  },
};
</script>

<style scoped>
.hours span::after {
  height: var(--calendarHeight);
}
</style>
