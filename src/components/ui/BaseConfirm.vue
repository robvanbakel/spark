<template>
  <base-modal tight centered :title="title">
    <template v-slot:main>
      {{ message }}
    </template>
    <template v-slot:actions>
      <base-button secondary @click="confirm(false)">{{ choiceFalse }}</base-button>
      <base-button @click="confirm(true)">{{ choiceTrue }}</base-button>
    </template>
  </base-modal>
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
      default: "I'm sure",
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
