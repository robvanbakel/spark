<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  suggestions: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: String,
    required: false,
  },
  addSuggestion: {
    type: Function,
    required: false,
  },
  deleteSuggestion: {
    type: Function,
    required: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const selectedSuggestion = ref(null);
const suggestionRightClickMenu = ref();

const showNewSuggestion = computed(() => {
  if (
    props.modelValue &&
    !props.suggestions
      .map((sug) => sug.toLowerCase())
      .includes(props.modelValue.toLowerCase())
  ) {
    return true;
  }
  return false;
});

const selectSuggestion = (suggestion) => {
  emit("update:modelValue", suggestion);
};

const suggestionRightClickHandler = async (event, suggestion) => {
  selectedSuggestion.value = suggestion;
  await suggestionRightClickMenu.value.open(event, suggestion);
  selectedSuggestion.value = null;
};
</script>

<template>
  <div class="suggestions">
    <span
      v-for="suggestion in suggestions"
      :key="suggestion"
      :class="{ selected: selectedSuggestion === suggestion }"
      @click="selectSuggestion(suggestion)"
      @click.right.prevent="suggestionRightClickHandler($event, suggestion)"
      >{{ suggestion }}</span
    >
    <span
      v-if="showNewSuggestion"
      class="add"
      @click="addSuggestion(modelValue)"
    >
      <span class="material-icons material-icons-round">add</span>
      {{ modelValue }}
    </span>
  </div>

  <RightClickMenu
    ref="suggestionRightClickMenu"
    :items="[
      {
        icon: 'delete',
        label: 'Delete',
        action: deleteSuggestion,
      },
    ]"
  />
</template>
