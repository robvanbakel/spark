<template>
  <div :class="['overlay', { dark, transparent, invisible }]" @click="this.$emit('clickout')"></div>
</template>

<script>
export default {
  emits:['clickout'],
  props: {
    dark: Boolean,
    transparent: Boolean,
    invisible: Boolean,
  },
};
</script>

<style></style>
