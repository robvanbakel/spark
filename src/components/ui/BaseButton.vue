<script setup>
defineProps({
  icon: {
    type: String,
    require: false,
  },
  inverted: {
    type: Boolean,
    require: false,
  },
  secondary: {
    type: Boolean,
    require: false,
  },
  iconOnly: {
    type: Boolean,
    require: false,
  },
  flipped: {
    type: Boolean,
    require: false,
  },
  color: {
    type: String,
    require: false,
  },
});
</script>

<template>
  <button
    :class="[
      'base-button',
      { inverted, secondary, 'icon-only': iconOnly },
      color,
    ]"
  >
    <span
      v-if="icon"
      :class="['material-icons material-icons-round', { flipped }]"
      >{{ icon }}</span
    >
    <slot />
  </button>
</template>
