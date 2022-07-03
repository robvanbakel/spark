<script setup>
import { ref, computed } from 'vue';

import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  id: {
    type: String,
  },
  items: {
    type: Array,
    require: true,
  },
  active: {
    type: String,
    require: false,
  },
  enableSearch: {
    type: Boolean,
    require: false,
    default: false,
  },
  error: {
    type: Boolean,
    require: false,
  },
  employeeStatus: {
    type: Boolean,
    require: false,
  },
});

const emit = defineEmits(['choice']);

const dropdownVisible = ref(false);
const selected = ref(props.active);
const hoveredIndex = ref(null);
const input = ref(props.items.find((item) => item.id === props.active)?.display || '');
const inputField = ref();

const selectedDisplay = computed(() => props.items.find((item) => item.id === selected.value)?.display || '');

const filteredItems = computed(() => {
  if (props.enableSearch) {
    return props.items.filter((item) => item.display.toLowerCase().includes(input.value.toLowerCase()));
  }
  return props.items;
});

const dropdownScrollOffset = computed(() => {
  if (hoveredIndex.value > 4) {
    return 4 * 40 - hoveredIndex.value * 40;
  }
  return 0;
});

const hideDropdown = () => {
  input.value = selectedDisplay.value;
  dropdownVisible.value = false;
  inputField.value.blur();
  hoveredIndex.value = null;
  window.removeEventListener('keydown', keyDownHandler);
};

const selectItem = (choice) => {
  selected.value = choice;
  hideDropdown();
  emit('choice', choice);
};

const keyDownHandler = (e) => {
  switch (e.key) {
    case 'Escape':
      hideDropdown();
      break;
    case 'Enter':
      selectItem(filteredItems.value[hoveredIndex.value].id);
      break;
    case 'ArrowUp':
      if (hoveredIndex.value === null) {
        hoveredIndex.value = filteredItems.value.length - 1;
      } else if (hoveredIndex.value === 0) {
        break;
      } else {
        hoveredIndex.value -= 1;
      }

      break;
    case 'ArrowDown':
      if (hoveredIndex.value === null) {
        hoveredIndex.value = 0;
      } else if (hoveredIndex.value === filteredItems.value.length - 1) {
        break;
      } else {
        hoveredIndex.value += 1;
      }
      break;
    default:
      break;
  }
};

const showDropdown = () => {
  if (props.enableSearch) {
    input.value = '';
  }
  dropdownVisible.value = true;
  inputField.value.focus();
  window.addEventListener('keydown', keyDownHandler);
};

const getStatus = (id, opt = {}) => {
  const { status } = store.getters['employees/employees'].find((emp) => emp.id === id);

  if (opt.capitalize) {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }
  return status.toLowerCase();
};
</script>

<template>
  <div class="base-dropdown">
    <div
      class="input-wrapper"
      :class="{ focus: dropdownVisible, enableSearch }"
      @click="showDropdown"
    >
      <input
        :id="id"
        ref="inputField"
        v-model="input"
        autocomplete="off"
        type="text"
        :class="['input', { error }]"
        :readonly="!enableSearch"
        @click="showDropdown"
        @focus="showDropdown"
        @keydown.tab="hideDropdown"
      >
    </div>
    <base-overlay
      v-if="dropdownVisible"
      invisible
      @clickout="hideDropdown"
    />
    <div
      v-if="dropdownVisible"
      class="dropdown"
    >
      <div
        v-if="filteredItems.length"
        class="dropdown-inner"
        :style="{ top: dropdownScrollOffset + 'px' }"
      >
        <div
          v-for="(item, index) in filteredItems"
          :key="item.id"
          :class="[
            'item',
            { active: item.id === selected && hoveredIndex === null },
            { active: index === hoveredIndex },
          ]"
          @click="selectItem(item.id)"
        >
          <span>{{ item.display }}</span>
          <span
            v-if="employeeStatus"
            :class="['status', getStatus(item.id)]"
          >{{
            getStatus(item.id, { capitalize: true })
          }}</span>
        </div>
      </div>
      <span
        v-else
        class="item no-match"
        @click="showDropdown"
      >No matches</span>
    </div>
  </div>
</template>
