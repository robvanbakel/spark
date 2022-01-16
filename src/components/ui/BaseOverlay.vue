<template>
  <div :class="['overlay', { dark, transparent, invisible }]" @click="this.$emit('clickout')"></div>
</template>

<script>
export default {
  emits: ["clickout"],
  props: {
    dark: Boolean,
    transparent: Boolean,
    invisible: Boolean,
  },
  mounted() {
    document.body.classList.add("noscroll")
  },
  unmounted() {
    if (!document.querySelector(".overlay")) {
      document.body.classList.remove("noscroll")
    }
  },
}
</script>

<style></style>
