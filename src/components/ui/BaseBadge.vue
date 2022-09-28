<script setup>
import { computed } from "vue";

const props = defineProps({
  status: {
    type: String,
    require: true,
  },
  label: {
    type: Boolean,
    default: true,
  },
});

const formatContent = computed(
  () =>
    props.status.substring(0, 1).toUpperCase() +
    props.status.substring(1).toLowerCase()
);

const getBadgeColor = () => {
  switch (props.status) {
    // Employee Status
    case "STAGED":
      return "blue";
    case "ACTIVE":
      return "green";
    case "UNAVAILABLE":
      return "yellow";
    case "SICK":
      return "purple";
    case "INACTIVE":
      return "orange";
    case "ARCHIVED":
      return "red";

    // Employee Role
    case "management":
      return "blue";
    case "leadership":
      return "green";
    case "general":
      return "yellow";
    case "restaurant":
      return "purple";
    case "cleaning":
      return "orange";

    // Shift status
    case "accepted":
      return "green";
    case "not accepted yet":
      return "orange";
    default:
      return "green";
  }
};
</script>

<template>
  <div class="badge" :class="[getBadgeColor(), { large: label }]">
    <div class="outer">
      <div class="inner" />
      <span v-if="label">{{ formatContent }}</span>
    </div>
  </div>
</template>
