<script setup lang="ts">
import { ref } from "vue";

defineProps({
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
  noFalse: {
    type: Boolean,
    default: false,
  },
});

const showConfirm = ref(false);
const choice = ref(null);

const open = () => {
  showConfirm.value = true;
  return new Promise((resolve) => {
    choice.value = resolve;
  });
};

const confirm = (bool) => {
  showConfirm.value = false;
  choice.value(bool);
};

defineExpose({
  open,
});
</script>

<template>
  <base-modal v-if="showConfirm" tight centered :title="title">
    <template #main>
      {{ message }}
    </template>
    <template #actions>
      <base-button v-if="!noFalse" secondary @click="confirm(false)">
        {{ choiceFalse }}
      </base-button>
      <base-button @click="confirm(true)">
        {{ choiceTrue }}
      </base-button>
    </template>
  </base-modal>
</template>
