<template>
  <div class="badge" :class="[getBadgeColor(), { large: label }]">
    <div class="outer">
      <div class="inner"></div>
      <span v-if="label">{{ formatContent }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      require: true,
    },
    label: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    formatContent() {
      return this.status.substring(0, 1).toUpperCase() + this.status.substring(1).toLowerCase()
    },
  },
  methods: {
    getBadgeColor() {
      switch (this.status) {
        // Employee Status
        case "staged":
          return "blue"
        case "active":
          return "green"
        case "unavailable":
          return "yellow"
        case "sick":
          return "purple"
        case "inactive":
          return "orange"
        case "archived":
          return "red"

        // Employee Role
        case "management":
          return "blue"
        case "leadership":
          return "green"
        case "general":
          return "yellow"
        case "restaurant":
          return "purple"
        case "cleaning":
          return "orange"

        // Shift status
        case "accepted":
          return "green"
        case "not accepted yet":
          return "orange"
      }
    },
  },
}
</script>
