<script setup>
import { ref, computed } from "vue";

import { useSettings } from "@/store";

const settingsStore = useSettings();

const props = defineProps({
  activeStatus: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["setActiveStatus"]);

const showDropdown = ref(false);

const statuses = computed(() => settingsStore.statuses.filter((status) => status !== "STAGED"));

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const setStatus = (status) => {
  if (status !== props.activeStatus) {
    emit("setActiveStatus", status);
    showDropdown.value = false;
  }
};
</script>

<template>
  <div class="status-picker-wrapper">
    <div class="current-status">
      <base-badge :status="activeStatus" :label="true" @click="toggleDropdown" />
    </div>
    <base-overlay v-if="showDropdown" invisible @clickout="showDropdown = false" />
    <div v-if="showDropdown" class="status-picker-dropdown">
      <base-badge
        v-for="status in statuses"
        :key="status"
        :status="status"
        :label="true"
        :class="{ active: status === activeStatus }"
        @click="setStatus(status)"
      />
    </div>
  </div>
</template>
