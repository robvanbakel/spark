<script setup>
import { ref, computed } from "vue";

import dayjs from "@/plugins/dayjs";

import DayPicker from "@/components/ui/BaseCalendar/DayPicker.vue";
import MonthPicker from "@/components/ui/BaseCalendar/MonthPicker.vue";

const props = defineProps({
  mode: {
    type: String,
    default: "picker",
  },
  modelValue: {
    type: [Object, null],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const mode = ref("DAY");

const currentView = ref((props.modelValue || dayjs()).startOf("month"));

const date = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const switchMode = (val) => {
  mode.value = val;
};
</script>

<template>
  <div :class="['calendar base-calendar', mode]">
    <DayPicker
      v-if="mode === 'DAY'"
      v-model:currentView="currentView"
      v-model:modelValue="date"
      @switch-mode="switchMode"
    />
    <MonthPicker
      v-if="mode === 'MONTH'"
      v-model:currentView="currentView"
      :date="date"
      @switch-mode="switchMode"
    />
  </div>
</template>
