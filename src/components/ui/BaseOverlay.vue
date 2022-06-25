<template>
  <div
    :class="['overlay', { dark, transparent, invisible }]"
    @click="$emit('clickout')"
  />
</template>

<script>
export default {
  props: {
    dark: Boolean,
    transparent: Boolean,
    invisible: Boolean,
  },
  emits: ['clickout'],
  mounted() {
    document.body.classList.add('noscroll');
  },
  unmounted() {
    if (!document.querySelector('.overlay')) {
      document.body.classList.remove('noscroll');
    }
  },
};
</script>
