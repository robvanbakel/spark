<script setup>
import ActivateAccount from '@/components/layout/ActivateAccount.vue';
import SignIn from '@/components/layout/SignIn.vue';
</script>

<template>
  <div class="auth">
    <div class="logo">
      <img
        src="@/assets/logo.svg"
        alt="Spark"
      >
    </div>
    <div v-if="$route.query.activationToken">
      <ActivateAccount />
    </div>
    <div v-else>
      <SignIn />
    </div>
  </div>
</template>
