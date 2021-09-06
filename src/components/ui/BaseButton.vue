<template>
  <button class="baseButton">
    <span v-if="icon" class="material-icons material-icons-round">{{icon}}</span>
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      require: false
    }
  }
};
</script>

