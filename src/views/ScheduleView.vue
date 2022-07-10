<script setup>
import {
  ref, onMounted, onUnmounted, onUpdated, computed, watch,
} from 'vue';

import QRCode from 'qrcode';
import dayjs from '@/plugins/dayjs';

import PlannerCalendar from '@/components/layout/PlannerCalendar.vue';
import EmployeeInfo from '@/components/layout/EmployeeInfo.vue';

import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import { useDate } from '@/pinia';

const dateStore = useDate();

const store = useStore();
const route = useRoute();

const qrCodeImg = ref(null);
const calendarWidth = ref(null);
const calendarHeight = ref(null);
const calendar = ref();
const confirmAcceptAllShifts = ref();
const acceptRightClickMenu = ref();
const showQR = ref(false);
const activeShift = ref(null);
const visibleHoursStart = ref(0);
const visibleHoursEnd = ref(0);

const webcalLink = computed(() => `webcal://app.sparkscheduler.com/feed/${store.getters['auth/user'].feedToken}`);

const schedulesInView = computed(() => {
  const shiftsInView = dateStore.dates
    .map((date) => store.getters['planner/shifts']
      .find((shift) => shift.employeeId === store.getters['auth/user'].id && date.isSame(shift.from, 'date')));

  if (shiftsInView.every((v) => !v)) return null;

  return shiftsInView;
});

const totalHours = computed(() => schedulesInView.value.reduce((acc, shift) => {
  if (!shift) return acc;
  const shiftDuration = dayjs.duration(shift.to.diff(shift.from)).subtract(shift.break, 'minutes');
  return acc + shiftDuration.asHours();
}, 0));

const workingDays = computed(() => schedulesInView.value.filter((v) => v).length);

const hasUnacceptedShifts = computed(() => schedulesInView.value?.map((shift) => shift && shift.status === 'ACCEPTED').some((accepted) => accepted === false));

const hoursVisible = computed(() => (visibleHoursEnd.value || 24) - visibleHoursStart.value);

const dayWidth = computed(() => calendarWidth.value / hoursVisible.value);

const hideSidebar = computed(() => store.getters['settings/hideSidebar']);

watch(route, (to) => {
  if (to.name === 'Schedule') {
    const { weekId } = route.params;
    dateStore.setDates(weekId);
    document.title = `Week ${dateStore.weekNumber} - Planner`;
  }
});

const checkCalendarWidth = () => {
  calendarWidth.value = calendar.value?.clientWidth;
  calendarHeight.value = calendar.value?.clientHeight;
};

watch(hideSidebar, () => {
  setTimeout(() => {
    checkCalendarWidth();
  }, 280); // Wait for CSS animation to finish
});

onMounted(() => {
  checkCalendarWidth();
  window.addEventListener('resize', checkCalendarWidth);
});

onUnmounted(() => window.removeEventListener('resize', checkCalendarWidth));

onUpdated(() => {
  if (calendarWidth.value && calendarWidth.value) return;
  checkCalendarWidth();
});

const generateQR = async () => {
  qrCodeImg.value = await QRCode.toDataURL(webcalLink.value);
  showQR.value = true;
};

const closeQR = () => {
  showQR.value = false;
};

const openCalendar = () => {
  window.location.replace(webcalLink.value);
};

const timeRangeToPercentage = (from, to) => {
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

  const percentage = (hoursPercentage + minsPercentage) / hoursVisible.value;

  // Calculate starting point
  const startHourPercentage = (startHour - visibleHoursStart.value) * 100;
  const startMinPercentage = (startMin / 60) * 100;
  const startPoint = (startHourPercentage + startMinPercentage) / hoursVisible.value;

  return { startPoint, percentage };
};

const setActiveShift = (shift, index) => {
  // Helper functions

  const calculateShiftDuration = (selectedShift) => {
    const shiftDuration = dayjs.duration(selectedShift.to.diff(selectedShift.from)).subtract(selectedShift.break, 'minutes');
    return shiftDuration.asHours();
  };

  // Construct object
  activeShift.value = {
    date: dateStore.dates[index].format('dddd LL'),
    dateShort: dateStore.dates[index].format('L'),
    location: shift.location,
    from: shift.from,
    to: shift.to,
    duration: calculateShiftDuration(shift),
    break: shift.break,
    status: shift.status,
    id: shift.id,
  };

  if (shift.notes) {
    activeShift.value.notes = shift.notes;
  }
};

const acceptAllShifts = async () => {
  if (await confirmAcceptAllShifts.value.open()) {
    const nonAcceptedShiftIds = schedulesInView.value.map((shift) => shift && shift.status !== 'ACCEPTED' && shift.id).filter((v) => v);
    store.dispatch('planner/acceptShifts', nonAcceptedShiftIds);
  }
};

const closeActiveShift = () => {
  activeShift.value = null;
};

const acceptProposal = (shiftId) => {
  store.dispatch('planner/acceptShifts', [shiftId || activeShift.value.id]);
  closeActiveShift();
};

const declineProposal = () => {
  closeActiveShift();
};

const proposalRightClickHandler = async (event, id) => {
  if (!id) return;

  event.preventDefault();
  await acceptRightClickMenu.value.open(event, id);
};

const helpActiveShift = () => {
  const to = 'planner@company.com';
  const subject = `${activeShift.value.dateShort}: Question about my shift (${activeShift.value.location})`;

  window.open(`mailto:${to}?subject=${subject}`);
};
</script>

<template>
  <main v-if="store.getters['auth/user'] && store.getters['planner/shifts']">
    <section id="singleEmployeeCalendar">
      <div class="header">
        <h1>Hi {{ store.getters["auth/user"].firstName }}</h1>
        <div
          v-if="schedulesInView"
          class="week-info"
        >
          <div>
            Week: <span>{{ dateStore.weekNumber }}</span>
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
            v-for="date in dateStore.dates"
            :key="date"
            class="row"
            :class="{ today: date.isSame(dayjs(), 'date') }"
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
            >{{ dayjs().hour(index + visibleHoursStart).minute(0).format('HH:mm') }}</span>
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
              @click.right="day.status === 'PROPOSED' && proposalRightClickHandler($event, day.id)"
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
          {{ dateStore.weekNumber }}.
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
          @click="declineProposal()"
        >
          Decline
        </base-button>
        <base-button
          icon="check"
          @click="acceptProposal()"
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

    <RightClickMenu
      ref="acceptRightClickMenu"
      :items="[
        {
          icon: 'check',
          label: 'Accept',
          action: acceptProposal,
        },
        {
          icon: 'close',
          label: 'Decline',
          action: declineProposal,
        },
      ]"
    />

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

<style scoped>
.hours span::after {
  height: var(--calendarHeight);
}
</style>
