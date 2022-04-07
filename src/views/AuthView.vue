<template>
  <div class="auth">
    <div class="logo">
      <img src="@/assets/logo.svg" alt="Spark" />
    </div>
    <div v-if="$route.query.activationToken">
      <ActivateAccount />
    </div>
    <div v-else>
      <SignIn />
    </div>
  </div>
</template>

<script>
import ActivateAccount from '@/components/layout/ActivateAccount.vue';
import SignIn from '@/components/layout/SignIn.vue';

export default {
  components: {
    ActivateAccount,
    SignIn,
  },
  data() {
    return {
      userStatus: null,
    };
  },
};
</script>
