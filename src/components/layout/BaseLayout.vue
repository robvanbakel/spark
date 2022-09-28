<script setup lang="ts">
import { useSettings } from "@/store";

const settingsStore = useSettings();
</script>

<template>
  <div class="base-layout">
    <nav v-if="$slots.nav">
      <slot name="nav" />
    </nav>
    <main>
      <div v-if="$slots.actionbar">
        <slot name="actionbar" />
      </div>
      <div class="content">
        <section class="main">
          <slot />
        </section>
        <aside
          v-if="$slots.sidebar"
          :class="{ hidden: settingsStore.sidebarHidden }"
        >
          <slot name="sidebar" />
        </aside>
      </div>
    </main>
  </div>
</template>
