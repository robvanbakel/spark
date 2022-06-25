<template>
  <div class="status-picker-wrapper">
    <div class="current-status">
      <base-badge
        :status="activeStatus"
        :label="true"
        @click="toggleDropdown"
      />
    </div>
    <base-overlay
      v-if="showDropdown"
      invisible
      @clickout="showDropdown = false"
    />
    <div
      v-if="showDropdown"
      class="status-picker-dropdown"
    >
      <base-badge
        v-for="status in statuses"
        :key="status"
        :status="status"
        :label="true"
        :class="{ active: status === activeStatus }"
        @click="setStatus(status)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeStatus: {
      type: String,
      required: true,
    },
  },
  emits: ['setActiveStatus'],
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
    statuses() {
      return this.$store.getters['settings/statuses'].filter((status) => status !== 'STAGED');
    },
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    setStatus(status) {
      if (status !== this.activeStatus) {
        this.$emit('setActiveStatus', status);
        this.showDropdown = false;
      }
    },
  },
};
</script>
