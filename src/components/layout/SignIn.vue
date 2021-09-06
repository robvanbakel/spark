<template>
  <div class="auth-modal">
    <h1>Log In</h1>
    <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
    <form @submit.prevent="handleSubmit">
      <input type="email" placeholder="Email" v-model.trim="email" ref="email" required />
      <input type="password" placeholder="Password" v-model="password" ref="password" required />
      <base-button v-if="!isLoading">Log In</base-button>
      <base-button v-else disabled>Loading…</base-button>
      <a href="#">Forgot Password?</a>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorMessage: null,
      email: "",
      password: "",
      isLoading: false,
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true

      const res = await this.$store.dispatch("auth/login", {
        email: this.email,
        password: this.password,
      })

      this.isLoading = false

      switch (res.code) {
        case "auth/user-not-found":
          this.errorMessage = "User not found"
          break
        case "auth/wrong-password":
          this.errorMessage = "Password incorrect"
          break
        default:
          this.errorMessage = "Login failed"
      }
    },
  },
}
</script>
