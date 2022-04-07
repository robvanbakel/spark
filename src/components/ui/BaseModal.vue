<template>
  <base-overlay dark transparent @click="close(this.clickout)"></base-overlay>
  <div :class="['base-modal', { tight, centered }, this.class]">
    <div v-if="!noHeader" class="header">
      <h1>{{ this.title }}</h1>
      <slot name="header"></slot>
      <span v-if="globalClose" class="material-icons material-icons-round" @click="close">clear</span>
    </div>
    <div class="main">
      <slot name="main"></slot>
    </div>
    <div v-if="!noActions" class="actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
  },
  emits: ['close'],
  methods: {
    close(bool) {
      if (bool) {
        this.$emit('close');
      }
    },
  },
};
</script>
