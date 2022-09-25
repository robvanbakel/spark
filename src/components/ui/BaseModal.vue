<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
    require: false,
  },
  title: {
    type: String,
    require: false,
  },
  noHeader: {
    type: Boolean,
    require: false,
  },
  noActions: {
    type: Boolean,
    require: false,
  },
  tight: {
    type: Boolean,
    require: false,
  },
  centered: {
    type: Boolean,
    require: false,
  },
  globalClose: {
    type: Boolean,
    require: false,
  },
  clickout: {
    type: Boolean,
    require: false,
  },
});

const emit = defineEmits(["close"]);

const close = (bool) => {
  if (bool) {
    emit("close");
  }
};
</script>

<template>
  <base-overlay dark transparent @click="close(clickout)" />
  <div :class="['base-modal', { tight, centered }, props.class]">
    <div v-if="!noHeader" class="header">
      <h1>{{ title }}</h1>
      <slot name="header" />
      <span v-if="globalClose" class="material-icons material-icons-round" @click="close"
        >clear</span
      >
    </div>
    <div class="main">
      <slot name="main" />
    </div>
    <div v-if="!noActions" class="actions">
      <slot name="actions" />
    </div>
  </div>
</template>
