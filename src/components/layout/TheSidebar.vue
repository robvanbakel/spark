<template>
  <aside :class="{ hidden: $store.getters['settings/hideSidebar'] }">
    <slot></slot>
  </aside>
</template>

<script>
export default {}
</script>
