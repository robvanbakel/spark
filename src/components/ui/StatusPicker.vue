<template>
  <div class="status-picker-wrapper">
    <div class="current-status">
      <base-badge :status="activeStatus" :label="true" @click="toggleDropdown"></base-badge>
    </div>
    <base-overlay v-if="showDropdown" invisible @clickout="showDropdown = false"></base-overlay>
    <div class="status-picker-dropdown" v-if="showDropdown">
      <base-badge
        v-for="status in statuses"
        :key="status"
        :status="status"
        :label="true"
        :class="{ active: status === this.activeStatus }"
        @click="setStatus(status)"
      ></base-badge>
    </div>
  </div>
</template>

<script>
export default {
  props: ['activeStatus'],
  data() {
    return {
      showDropdown: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    setStatus(status) {
      if (status != this.activeStatus) {
        this.$emit('setActiveStatus', status);
        this.showDropdown = false;
      }
    },
  },
  computed: {
    statuses() {
      return this.$store.getters['settings/statuses'].filter((status) => status !== 'staged');
    },
  },
};
</script>

<style></style>
