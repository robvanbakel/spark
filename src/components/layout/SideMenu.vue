<script setup lang="ts">
import { watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

interface MenuItem {
  title: string;
  icon?: string;
  hash: string;
}

interface Props {
  items: MenuItem[][];
  modelValue?: MenuItem;
}

const props = defineProps<Props>();

const emit = defineEmits(["update:modelValue"]);

const route = useRoute();
const router = useRouter();

const isActive = (itemHash: string) => route.hash === itemHash;

const activeItem = computed(() =>
  props.items.flat().find((item) => item.hash === route.hash)
);

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
    <div class="header">
      <slot />
    </div>
    <ul v-for="(group, groupIndex) in items" :key="groupIndex">
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
