<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  toggle: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    default: () => [],
  },
  fixed: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Boolean],
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const indicator = ref();
const wrapper = ref();
const item = ref();

watch(() => props.modelValue, (val) => {
  setIndicator(val);
});

onMounted(() => {
  setIndicator(props.modelValue);

  setTimeout(() => {
    indicator.value.style.transition = 'all 120ms ease-in-out';
  }, 120);
});

const setIndicator = (val) => {
  const target = [...item.value].find((v) => {
    if (props.toggle) {
      return v.attributes['data-value'].value === val.toString();
    }

    return v.innerText === val;
  });

  if (!target) return;

  indicator.value.style.left = `${target.getBoundingClientRect().left - wrapper.value.getBoundingClientRect().left}px`;
  indicator.value.style.width = `${target.getBoundingClientRect().width}px`;
};

const setActive = (value) => {
  setIndicator(value);

  emit('update:modelValue', value);
};

const keydownHandler = (e) => {
  const activeIndex = props.items.indexOf(props.modelValue);
  switch (e.code) {
    case 'ArrowLeft':
      if (activeIndex === 0) return;
      setActive(props.items[activeIndex - 1]);
      break;
    case 'ArrowRight':
      if (activeIndex === props.items.length - 1) return;
      setActive(props.items[activeIndex + 1]);
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
        v-for="bool in [true, false]"
        :key="bool"
        ref="item"
        :data-value="bool"
        class="switch-control toggle fixed"
        @click="setActive(bool)"
      >
        <span class="material-icons material-icons-round">{{ bool ? 'check' : 'close' }}</span>
      </div>
    </div>

    <div v-else>
      <div
        v-for="val in items"
        :key="val"
        ref="item"
        :class="['switch-control', { fixed }]"
        @click="setActive(val)"
      >
        {{ val }}
      </div>
    </div>
  </div>
</template>
