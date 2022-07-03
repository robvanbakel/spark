<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
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
});

const emit = defineEmits(['activeItem']);

const indicator = ref();
const wrapper = ref();

const findAndSetActive = (activeItem = props.active) => {
  const switchItems = document.querySelectorAll(`#${props.id}.switch-control`);

  if (props.toggle) {
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
};

onMounted(() => {
  findAndSetActive();

  setTimeout(() => {
    indicator.value.style.transition = 'all 120ms ease-in-out';
  }, 120);
});

const setActive = (e, item) => {
  const activeLeft = `${e.target.getBoundingClientRect().left - wrapper.value.getBoundingClientRect().left}px`;
  const activeWidth = `${e.target.getBoundingClientRect().width}px`;

  indicator.value.style.left = activeLeft;
  indicator.value.style.width = activeWidth;

  emit('activeItem', item);
};

const keydownHandler = (e) => {
  const activeIndex = props.items.indexOf(props.active);
  switch (e.code) {
    case 'ArrowLeft':
      findAndSetActive(props.items[activeIndex - 1]);
      break;
    case 'ArrowRight':
      findAndSetActive(props.items[activeIndex + 1]);
      break;
    default:
      break;
  }
};

</script>

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
