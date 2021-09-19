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

  <transition name="demo">
    <div v-if="showDemo" class="auth-modal demo">
      <h1>No account yet?</h1>
      <p>Click the button below to enter a demo account. Any changes you make won't be stored and will be lost when existing the demo environment.</p>
      <base-button v-if="!demoLoading" icon="login" @click="enterDemo">Enter Demo</base-button>
      <base-button v-else disabled icon="login">Loading…</base-button>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      errorMessage: null,
      email: "",
      password: "",
      isLoading: false,
      showDemo: false,
      demoLoading: false,
    }
  },
  methods: {
    async enterDemo() {
      this.demoLoading = true

      await this.$store.dispatch("auth/login", {
        email: "demo@company.com",
        password: "demo@company.com",
      })
    },
    async handleSubmit() {
      this.isLoading = true

      const res = await this.$store.dispatch("auth/login", {
        email: this.email,
        password: this.password,
      })

      if (!res.user) {
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
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.showDemo = true
    }, 650)
  },
}
</script>

<style>
.demo-enter-from {
  transform: translateY(16px);
  opacity: 0;
}

.demo-enter-active {
  transition: all 500ms ease-out;
}
</style>
