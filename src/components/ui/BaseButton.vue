<template>
  <button :class="['base-button', { inverted, secondary, 'icon-only': iconOnly }, this.color]">
    <span v-if="icon" :class="['material-icons material-icons-round', { flipped }]">{{ icon }}</span>
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
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
  },
};
</script>
