<script setup lang="ts">
import { watch, computed, useSlots } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { MenuItem } from "@/types/global";

interface Props {
  items: MenuItem[][];
  modelValue?: MenuItem;
}

const props = defineProps<Props>();
const slots = useSlots();

const emit = defineEmits(["update:modelValue"]);

const route = useRoute();
const router = useRouter();

const isActive = (itemHash: string) => route.hash === itemHash;

const activeItem = computed(() =>
  props.items.flat().find((item) => item.hash === route.hash)
);

const menuItems = computed(() => {
  return props.items.map((group) => {
    return group.filter((item) => !item.hidden);
  });
});

if (!route.hash) {
  router.replace({ hash: props.items[0][0].hash });
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
    <div v-if="slots.header" class="header">
      <slot name="header" />
    </div>
    <ul v-for="(group, groupIndex) in menuItems" :key="groupIndex">
      <li v-for="(item, itemIndex) in group" :key="itemIndex">
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
    </ul>
  </nav>
</template>
