<template>
  <div class="base-dropdown">
    <div class="input-wrapper" :class="{ focus: dropdownVisible, enableSearch }" @click="showDropdown">
      <input
        autocomplete="off"
        type="text"
        :class="['input', { error }]"
        @click="showDropdown"
        :readonly="!enableSearch"
        ref="input"
        v-model="input"
      />
    </div>
    <base-overlay v-if="dropdownVisible" @clickout="hideDropdown" invisible></base-overlay>
    <div class="dropdown" v-if="dropdownVisible">
      <div v-if="this.filteredItems.length">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          :class="['item', { active: item.id === this.selected }]"
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
      input: this.items.find((item) => item.id === this.active)?.display || "",
    }
  },
  computed: {
    selectedDisplay() {
      return this.items.find((item) => item.id === this.selected)?.display || ""
    },
    filteredItems() {
      if (this.enableSearch) {
        return this.items.filter((item) => item.display.toLowerCase().includes(this.input.toLowerCase()))
      } else {
        return this.items
      }
    },
  },
  methods: {
    showDropdown() {
      if (this.enableSearch) {
        this.input = ""
      }
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
    getStatus(id, opt = {}) {
      const status = this.$store.getters["employees/employees"].find((emp) => emp.id === id).status

      if (opt.capitalize) {
        return status.charAt(0).toUpperCase() + status.slice(1)
      } else {
        return status
      }
    },
  },
}
</script>
