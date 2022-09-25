<script setup lang=ts>
import { watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(["update:modelValue"]);

const route = useRoute();
const router = useRouter();

const isActive = (itemHash) => route.hash === itemHash;

const activeItem = computed(() => props.items.find((item) => item.hash === route.hash));

if (!route.hash) {
  router.replace({ hash: props.items[0].hash });
}

watch(
  () => route.hash,
  () => {
    emit("update:modelValue", activeItem.value);
  },
  { immediate: true }
);
</script>

<template>
  <nav class="side">
    <div class="header">
      <slot />
    </div>
    <ul>
      <div v-for="(item, index) in items" :key="index">
        <hr v-if="item.divider" />
        <li v-else>
          <router-link :to="{ hash: item.hash }">
            <span
              v-if="item.icon"
              class="icon"
              :class="
                isActive(item.hash)
                  ? 'material-icons material-icons-round'
                  : 'material-symbols-outlined'
              "
              >{{ item.icon }}</span
            >
            <span :class="{ active: isActive(item.hash) }">{{ item.title }}</span>
          </router-link>
        </li>
      </div>
    </ul>
  </nav>
</template>
