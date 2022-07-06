<script setup>
import { ref, computed } from 'vue';
import BaseCalendar from '@/components/ui/BaseCalendar/BaseCalendar.vue';

const props = defineProps({
  error: {
    type: Boolean,
    require: false,
  },
  modelValue: {
    type: [Object, null],
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const calendarVisible = ref(false);

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

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
    hideCalendar();
  },
});
</script>

<template>
  <div class="base-date-picker">
    <input
      :value="modelValue?.format($store.getters['settings/settings'].dateNotation)"
      readonly
      :class="{ focus: calendarVisible, error }"
      @click="showCalendar"
      @focus="showCalendar"
      @keydown.tab="hideCalendar"
    >
    <div v-if="calendarVisible">
      <base-overlay
        invisible
        @clickout="hideCalendar"
      />
      <BaseCalendar v-model="value" />
    </div>
  </div>
</template>
