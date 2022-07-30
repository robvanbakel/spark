<script setup>
import { ref } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const showMenu = ref(false);
const top = ref(0);
const left = ref(0);
const target = ref(null);
const click = ref(null);

const open = (event, targetEl) => {
  top.value = `${event.pageY}px`;
  left.value = `${event.pageX}px`;
  target.value = targetEl;
  showMenu.value = true;
  return new Promise((resolve) => {
    click.value = resolve;
  });
};

const close = () => {
  click.value(showMenu.value = false);
};

const clickHandler = (item) => {
  item.action(target.value);
  close();
};

defineExpose({
  open,
});

</script>

<template>
  <div v-if="showMenu">
    <base-overlay
      invisible
      @click="close(clickout)"
    />
    <Teleport to="body">
      <div
        class="right-click-menu"
        :style="{top, left}"
      >
        <div
          v-for="item in props.items"
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
    </Teleport>
  </div>
</template>
