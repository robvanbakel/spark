<template>
  <div class="base-dropdown">
    <div class="input-wrapper" :class="[icon, { focus: dropdownVisible }]" :data-icon="icon">
      <input type="text" class="input" @click="showDropdown" :class="{ error }" ref="input" v-model="input" />
    </div>
    <base-overlay v-if="dropdownVisible" @clickout="hideDropdown" invisible></base-overlay>
    <div class="dropdown" v-if="dropdownVisible">
      <div v-if="this.filteredItems.length">
        <span
          v-for="item in filteredItems"
          :key="item.id"
          :class="['item', { active: item.id === input.id }]"
          @click="selectItem(item.id)"
          >{{ item.display }}</span
        >
      </div>
      <span class="item no-match" v-else @click="showDropdown">No matches</span>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["choice"],
  props: {
    items: {
      type: Array,
      require: true,
    },
    active: {
      type: String,
      require: false,
    },
    icon: {
      type: String,
      require: false,
      default: "expand_more",
    },
    error: {
      type: Boolean,
      require: false,
    },
  },
  data() {
    return {
      dropdownVisible: false,
      selected: this.active,
      input: this.items.find((item) => item.id === this.active)?.display || "",
    }
  },
  computed: {
    selectedDisplay() {
      return this.items.find((item) => item.id === this.selected)?.display || ""
    },
    filteredItems() {
      return this.items.filter((item) => item.display.toLowerCase().includes(this.input.toLowerCase()))
    },
  },
  methods: {
    showDropdown() {
      this.input = ""
      this.dropdownVisible = true
      this.$refs.input.focus()
      window.addEventListener("keydown", this.keyDownHandler)
    },
    keyDownHandler(e) {
      if (e.key === "Escape") {
        this.hideDropdown()
      }
    },
    hideDropdown() {
      this.input = this.selectedDisplay
      this.dropdownVisible = false
      this.$refs.input.blur()
      window.removeEventListener("keydown", this.keyDownHandler)
    },
    selectItem(choice) {
      this.selected = choice
      this.hideDropdown()
      this.$emit("choice", choice)
    },
  },
}
</script>
