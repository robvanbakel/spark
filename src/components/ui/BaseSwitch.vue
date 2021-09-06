<template>
  <div class="switch-wrapper" ref="wrapper">
    <div class="indicator" ref="indicator"></div>
    <div v-for="item in items" :class="['switch-control', { fixed: this.fixed }]" :key="item" @click="setActive($event, item)" ref="item">
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["items", "active", "fixed"],
  emits: ["activeItem"],
  methods: {
    setActive(e, item) {

      const activeLeft = e.target.getBoundingClientRect().left - this.$refs.wrapper.getBoundingClientRect().left + "px";
      const activeWidth = e.target.getBoundingClientRect().width + "px";

      this.$refs.indicator.style.left = activeLeft;
      this.$refs.indicator.style.width = activeWidth;

      this.$emit("activeItem", item);
    },
  },
  mounted() {
    if (this.active) {
      const switchItems = document.querySelectorAll(".switch-control");
      switchItems.forEach((item) => {
        if (item.innerText === this.active) {
          item.click();
        }
      });
    }

    setTimeout(() => {
      this.$refs.indicator.style.transition = "all 120ms ease-in-out";
    }, 120);
  },
};
</script>
