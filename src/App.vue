<template>
  <div class="container">
    <TheHeader v-if="this.$store.getters['auth/user']" />
    <router-view></router-view>
  </div>
</template>

<script>
import TheHeader from "@/components/layout/TheHeader";

export default {
  name: "App",
  components: {
    TheHeader,
  },
};
</script>

<style>
</style>