<template>
  <base-modal
    v-if="showConfirm"
    tight
    centered
    :title="title"
  >
    <template #main>
      {{ message }}
    </template>
    <template #actions>
      <base-button
        v-if="!noFalse"
        secondary
        @click="confirm(false)"
      >
        {{ choiceFalse }}
      </base-button>
      <base-button @click="confirm(true)">
        {{ choiceTrue }}
      </base-button>
    </template>
  </base-modal>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Are you sure?',
    },
    message: {
      type: String,
      default: 'This action cannot be undone.',
    },
    choiceFalse: {
      type: String,
      default: 'Cancel',
    },
    choiceTrue: {
      type: String,
      default: "I'm sure",
    },
    noFalse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showConfirm: false,
      choice: null,
    };
  },
  methods: {
    open() {
      this.showConfirm = true;
      return new Promise((resolve) => {
        this.choice = resolve;
      });
    },
    confirm(choice) {
      this.showConfirm = false;
      this.choice(choice);
    },
  },
};
</script>
