<template>
  <div class="base-dropdown">
    <div class="input" @click="showDropdown" :class="{ focus: dropdownVisible }">
      {{ input.display }}
    </div>
    <base-overlay v-if="dropdownVisible" @clickout="hideDropdown" invisible></base-overlay>
    <div class="dropdown" v-if="dropdownVisible">
      <span
        v-for="item in items"
        :key="item.id"
        :class="['item', { active: item.id === input.id }]"
        @click="selectItem(item.id)"
        >{{ item.display }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  emits: ['choice'],
  props: {
    items: {
      type: Array,
      require: true,
    },
    active: {
      type: String,
      require: false,
    },
  },
  data() {
    return {
      dropdownVisible: false,
      input: this.items.find((item) => item.id === this.active),
    }
  },
  methods: {
    showDropdown() {
      this.dropdownVisible = true
    },
    hideDropdown() {
      this.dropdownVisible = false
    },
    selectItem(choice) {
      this.input = this.items.find((item) => item.id === choice)
      this.hideDropdown()
      this.$emit('choice', choice)
    },
  },
}
</script>

<style></style>