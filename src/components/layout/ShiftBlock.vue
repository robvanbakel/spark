<script setup>
import { computed } from "vue";

const props = defineProps({
  shift: {
    type: [Object, null],
    default: null,
  },
});

const statusIcons = computed(() => {
  const icons = {
    description: props.shift?.notes,
    question_mark: props.shift?.status === "PROPOSED",
    edit: props.shift?.status === "DRAFT",
  };

  return Object.keys(icons).filter((icon) => icons[icon]);
});
</script>

<template>
  <div
    class="shift-block"
    :class="[{ active: shift }, shift?.status.toLowerCase()]"
  >
    <div v-if="shift" class="info-wrapper">
      <div class="icons">
        <span
          v-for="icon in statusIcons"
          :key="icon"
          class="material-symbols-outlined"
          >{{ icon }}</span
        >
      </div>
      <span class="location">{{ shift.location }}</span>
      <span class="time">
        {{ shift.from.format("HH:mm") }} - {{ shift.to.format("HH:mm") }}
      </span>
    </div>
  </div>
</template>
