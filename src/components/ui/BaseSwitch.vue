<template>
  <div
    ref="wrapper"
    class="switch-wrapper"
    @keydown="keydownHandler"
  >
    <div
      ref="indicator"
      class="indicator"
    />

    <div v-if="toggle">
      <div
        v-for="item in [true, false]"
        :id="id"
        :key="item"
        ref="item"
        :data-value="item"
        class="switch-control toggle fixed"
        @click="setActive($event, item)"
      >
        <span
          v-if="item"
          class="material-icons material-icons-round"
        >check</span>
        <span
          v-else
          class="material-icons material-icons-round"
        >close</span>
      </div>
    </div>

    <div v-else>
      <div
        v-for="item in items"
        :id="id"
        :key="item"
        ref="item"
        :class="['switch-control', { fixed: fixed }]"
        @click="setActive($event, item)"
      >
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
      type: String,
    },
  },
  emits: ['activeItem'],
  mounted() {
    this.findAndSetActive();

    setTimeout(() => {
      this.$refs.indicator.style.transition = 'all 120ms ease-in-out';
    }, 120);
  },
  methods: {
    setActive(e, item) {
      const activeLeft = `${e.target.getBoundingClientRect().left - this.$refs.wrapper.getBoundingClientRect().left}px`;
      const activeWidth = `${e.target.getBoundingClientRect().width}px`;

      this.$refs.indicator.style.left = activeLeft;
      this.$refs.indicator.style.width = activeWidth;

      this.$emit('activeItem', item);
    },
    keydownHandler(e) {
      const activeIndex = this.items.indexOf(this.active);
      switch (e.code) {
        case 'ArrowLeft':
          this.findAndSetActive(this.items[activeIndex - 1]);
          break;
        case 'ArrowRight':
          this.findAndSetActive(this.items[activeIndex + 1]);
          break;
        default:
          break;
      }
    },
    findAndSetActive(activeItem = this.active) {
      const switchItems = document.querySelectorAll(`#${this.id}.switch-control`);

      if (this.toggle) {
        switchItems.forEach((item) => {
          if (item.attributes['data-value'].value === activeItem) {
            item.click();
          }
        });
      } else {
        switchItems.forEach((item) => {
          if (item.innerText === activeItem) {
            item.click();
          }
        });
      }
    },
  },
};
</script>
