<template>
  <div class="base-dropdown">
    <div class="input-wrapper" :class="{ focus: dropdownVisible, enableSearch }" @click="showDropdown">
      <input
        autocomplete="off"
        :id="id"
        type="text"
        :class="['input', { error }]"
        @click="showDropdown"
        :readonly="!enableSearch"
        ref="input"
        v-model="input"
        @focus="showDropdown"
        @keydown.tab="hideDropdown"
      />
    </div>
    <base-overlay v-if="dropdownVisible" @clickout="hideDropdown" invisible></base-overlay>
    <div class="dropdown" v-if="dropdownVisible">
      <div class="dropdown-inner" :style="{ top: dropdownScrollOffset + 'px' }" v-if="this.filteredItems.length">
        <div
          v-for="(item, index) in filteredItems"
          :key="item.id"
          :class="[
            'item',
            { active: item.id === this.selected && this.hoveredIndex === null },
            { active: index === this.hoveredIndex },
          ]"
          @click="selectItem(item.id)"
        >
          <span>{{ item.display }}</span>
          <span v-if="employeeStatus" :class="['status', getStatus(item.id)]">{{
            getStatus(item.id, { capitalize: true })
          }}</span>
        </div>
      </div>
      <span class="item no-match" v-else @click="showDropdown">No matches</span>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['choice'],
  props: {
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
  },
  data() {
    return {
      dropdownVisible: false,
      selected: this.active,
      hoveredIndex: null,
      input: this.items.find((item) => item.id === this.active)?.display || '',
    };
  },
  computed: {
    selectedDisplay() {
      return this.items.find((item) => item.id === this.selected)?.display || '';
    },
    filteredItems() {
      if (this.enableSearch) {
        return this.items.filter((item) => item.display.toLowerCase().includes(this.input.toLowerCase()));
      }
      return this.items;
    },
    dropdownScrollOffset() {
      if (this.hoveredIndex > 4) {
        return 4 * 40 - this.hoveredIndex * 40;
      }
      return 0;
    },
  },
  methods: {
    showDropdown() {
      if (this.enableSearch) {
        this.input = '';
      }
      this.dropdownVisible = true;
      this.$refs.input.focus();
      window.addEventListener('keydown', this.keyDownHandler);
    },
    keyDownHandler(e) {
      switch (e.key) {
        case 'Escape':
          this.hideDropdown();
          break;
        case 'Enter':
          this.selectItem(this.filteredItems[this.hoveredIndex].id);
          break;
        case 'ArrowUp':
          if (this.hoveredIndex === null) {
            this.hoveredIndex = this.filteredItems.length - 1;
          } else if (this.hoveredIndex === 0) {
            break;
          } else {
            this.hoveredIndex -= 1;
          }

          break;
        case 'ArrowDown':
          if (this.hoveredIndex === null) {
            this.hoveredIndex = 0;
          } else if (this.hoveredIndex === this.filteredItems.length - 1) {
            break;
          } else {
            this.hoveredIndex += 1;
          }
          break;
        default:
          break;
      }
    },
    hideDropdown() {
      this.input = this.selectedDisplay;
      this.dropdownVisible = false;
      this.$refs.input.blur();
      this.hoveredIndex = null;
      window.removeEventListener('keydown', this.keyDownHandler);
    },
    selectItem(choice) {
      this.selected = choice;
      this.hideDropdown();
      this.$emit('choice', choice);
    },
    hoverItem(choice) {
      this.hovered = choice;
    },
    getStatus(id, opt = {}) {
      const { status } = this.$store.getters['employees/employees'].find((emp) => emp.id === id);

      if (opt.capitalize) {
        return status.charAt(0).toUpperCase() + status.slice(1);
      }
      return status;
    },
  },
};
</script>
