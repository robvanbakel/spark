<template>
  <div v-if="showMenu">
    <base-overlay
      invisible
      @click="close(clickout)"
    />
    <div
      class="right-click-menu"
      :style="{top, left}"
    >
      <div
        v-for="item in items"
        :key="item"
        class="right-click-menu-inner"
      >
        <div
          class="item"
          @click="clickHandler(item)"
        >
          <span
            v-if="item.icon"
            class="material-icons material-icons-round"
          >{{ item.icon }}</span>
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showMenu: false,
      top: 0,
      left: 0,
      target: null,
      click: null,
    };
  },
  methods: {
    open(event, target) {
      this.top = `${event.pageY}px`;
      this.left = `${event.pageX}px`;
      this.target = target;
      this.showMenu = true;
      return new Promise((resolve) => {
        this.click = resolve;
      });
    },
    clickHandler(item) {
      item.action(this.target);
      this.close();
    },
    close() {
      this.click(this.showMenu = false);
    },
  },
};
</script>
