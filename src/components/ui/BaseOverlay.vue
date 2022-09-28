<script setup>
import { onUnmounted } from "vue";

defineProps({
  dark: Boolean,
  transparent: Boolean,
  invisible: Boolean,
});

const emit = defineEmits(["clickout"]);

document.body.classList.add("noscroll");

onUnmounted(() => {
  if (!document.querySelector(".overlay")) {
    document.body.classList.remove("noscroll");
  }
});
</script>

<template>
  <div :class="['overlay', { dark, transparent, invisible }]" @click="emit('clickout')" />
</template>
