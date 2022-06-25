<template>
  <aside :class="{ hidden: $store.getters['settings/hideSidebar'] }">
    <slot />
  </aside>
</template>

<script>
export default {};
</script>
