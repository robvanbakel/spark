<template>
  <base-overlay dark transparent></base-overlay>
  <div class="modal confirm">
    <div class="header">
      <h1>{{ title }}</h1>
    </div>
    <div class="main">{{ message }}</div>
    <div class="form-actions">
      <button class="secondary" @click="confirm(false)">Cancel</button>
      <base-button @click="confirm(true)">Delete Shift</base-button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["confirm"],
  props: {
    title: {
      type: String,
      default: "Are you sure?",
    },
    message: {
      type: String,
      default: "This action cannot be undone.",
    },
  },
  methods: {
    confirm(choice) {
      this.$emit("confirm", choice)
    },
  },
}
</script>

<style></style>
