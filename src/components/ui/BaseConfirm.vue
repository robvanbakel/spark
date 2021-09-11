<template>
  <base-overlay dark transparent></base-overlay>
  <div class="modal confirm">
    <div class="header">
      <h1>{{ title }}</h1>
    </div>
    <div class="main">{{ message }}</div>
    <div class="form-actions">
      <button class="secondary" @click="confirm(false)">{{choiceFalse}}</button>
      <base-button @click="confirm(true)">{{choiceTrue}}</base-button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["choice"],
  props: {
    title: {
      type: String,
      default: "Are you sure?",
    },
    message: {
      type: String,
      default: "This action cannot be undone.",
    },
    choiceFalse: {
      type: String,
      default: "Cancel",
    },
    choiceTrue: {
      type: String,
      default: "Ok",
    },
  },
  methods: {
    confirm(choice) {
      this.$emit("choice", choice)
    },
  },
}
</script>

<style></style>
