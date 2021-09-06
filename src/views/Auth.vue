<template>
  <div class="auth">
    <div class="logo">
      <img src="@/assets/logo.svg" alt="Scheduler" />
    </div>
    <SignIn />
  </div>
</template>

<script>
import SignIn from "@/components/layout/SignIn";

export default {
  components: {
    SignIn,
  },
  data() {
    return {
      userStatus: null,
    };
  },
};
</script>
