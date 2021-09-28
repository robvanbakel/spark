<template>
  <div class="switch-wrapper" ref="wrapper">
    <div class="indicator" ref="indicator"></div>

    <div v-if="toggle">
      <div v-for="item in [true, false]" :data-value="item" :id="id" class="switch-control toggle fixed" :key="item" @click="setActive($event, item)" ref="item">
        <span v-if="item" class="material-icons material-icons-round">check</span>
        <span v-else class="material-icons material-icons-round">close</span>
      </div>
    </div>

    <div v-else>
      <div v-for="item in items" :class="['switch-control', { fixed: this.fixed }]" :key="item" @click="setActive($event, item)" ref="item">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    toggle: {
      type: Boolean,
    },
    items: {
      type: Array,
    },
    active: {
      type: String,
    },
    fixed: {
      type: Boolean,
    },
    id: {
      type: String
    }
  },
  emits: ["activeItem"],
  methods: {
    setActive(e, item) {
      const activeLeft = e.target.getBoundingClientRect().left - this.$refs.wrapper.getBoundingClientRect().left + "px"
      const activeWidth = e.target.getBoundingClientRect().width + "px"

      this.$refs.indicator.style.left = activeLeft
      this.$refs.indicator.style.width = activeWidth

      this.$emit("activeItem", item)
    },
  },
  mounted() {
    const switchItems = document.querySelectorAll(`#${this.id}.switch-control`)
    if (this.toggle) {
      switchItems.forEach((item) => {
        if (item.attributes["data-value"].value === this.active) {
          item.click()
        }
      })
    } else {
      switchItems.forEach((item) => {
        if (item.innerText === this.active) {
          item.click()
        }
      })
    }

    setTimeout(() => {
      this.$refs.indicator.style.transition = "all 120ms ease-in-out"
    }, 120)
  },
}
</script>
