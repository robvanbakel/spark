<template>
  <div v-if="!breakpoints.sm.active" class="container">
    <TheHeader v-if="$store.getters['auth/user']" />
    <router-view></router-view>
  </div>
  <div v-else style="text-align: center; padding: 3em 1em;">
    {{ $t('general.smallScreenWarning') }}
  </div>
</template>

<script>
import TheHeader from '@/components/layout/TheHeader.vue';

export default {
  name: 'App',
  data() {
    return {
      breakpoints: {
        sm: {
          width: 960,
          active: false,
        },
        md: {
          width: 1260,
          active: false,
        },
      },
    };
  },
  components: {
    TheHeader,
  },
  methods: {
    checkScreenSize() {
      if (window.innerWidth < this.breakpoints.sm.width) {
        this.setActiveBreakpoint('sm');
      } else if (window.innerWidth < this.breakpoints.md.width) {
        this.setActiveBreakpoint('md');

        if (!this.$store.getters['settings/hideSidebar']) {
          this.$store.dispatch('settings/hideSidebar', true);
          this.$store.dispatch('settings/sidebarAutoHidden', true);
        }
      } else {
        this.setActiveBreakpoint(null);
        if (this.$store.getters['settings/sidebarAutoHidden']) {
          this.$store.dispatch('settings/hideSidebar', false);
        }
      }
    },
    setActiveBreakpoint(selected) {
      Object.keys(this.breakpoints).forEach((breakpoint) => {
        this.breakpoints[breakpoint].active = false;
      });
      if (selected) {
        this.breakpoints[selected].active = true;
      }
    },
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
};
</script>

<style></style>
