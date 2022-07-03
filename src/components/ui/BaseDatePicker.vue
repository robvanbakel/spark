<script setup>
import { ref } from 'vue';
import BaseCalendar from '@/components/ui/BaseCalendar/BaseCalendar.vue';

const props = defineProps({
  active: {
    type: Object,
    require: false,
  },
  error: {
    type: Boolean,
    require: false,
  },
});

const emit = defineEmits(['date']);

const calendarVisible = ref(false);
const activeDate = ref(props.active || null);

const showCalendar = () => {
  calendarVisible.value = true;
  window.addEventListener('keydown', keyDownHandler);
};

const hideCalendar = () => {
  calendarVisible.value = false;
  window.removeEventListener('keydown', keyDownHandler);
};

const keyDownHandler = (e) => {
  switch (e.key) {
    case 'Escape':
      hideCalendar();
      break;
    default:
      break;
  }
};

const setDate = (date) => {
  activeDate.value = date;
  hideCalendar();
  emit('date', date);
};
</script>

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
