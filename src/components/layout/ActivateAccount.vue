<template>
  <div v-if="!success">
    <div class="auth-modal" v-if="!emailConfirmed">
      <h1>Welcome</h1>
      <p>Please enter your email address and click continue to choose a password.</p>
      <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
      <form @submit.prevent="validate">
        <input type="email" placeholder="Email" v-model.trim="email" />
        <base-button v-if="!loading" @click="confirmEmail">Continue</base-button>
        <base-button v-else disabled>Loading…</base-button>
      </form>
    </div>

    <div class="auth-modal" v-else>
      <h1>Hi {{ firstName }}</h1>
      <p>Choose a strong password and submit in order to activate your account and login to see your schedule.</p>
      <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
      <form @submit.prevent="validate">
        <input type="password" placeholder="Password" v-model="password" />
        <input type="password" placeholder="Repeat password" v-model="repeatPassword" />
        <base-button v-if="!loading" @click="setPassword">Activate Account</base-button>
        <base-button v-else disabled>Loading…</base-button>
      </form>
    </div>
  </div>

  <div class="auth-modal success" v-else>
    <h1>Success!</h1>
    <p>Your account has been successfully activated! You can now log in to the planner to see your schedule.</p>
    <base-button icon="login" @click="toLogin">Login page</base-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorMessage: null,
      emailConfirmed: false,
      loading: false,
      firstName: null,
      success: false,
      email: "",
      password: "",
      repeatPassword: "",
    }
  },
  methods: {
    async confirmEmail() {
      this.loading = true

      const baseUrl = `${process.env.VUE_APP_ADMIN_HOST || ""}/activateAccount`

      const activationToken = this.$route.query.activationToken
      const email = encodeURIComponent(this.email)

      try {
        const res = await fetch(`${baseUrl}?activationToken=${activationToken}&email=${email}`)

        if (res.ok) {
          const { firstName } = await res.json()
          this.emailConfirmed = true

          this.firstName = firstName
          this.errorMessage = null
        } else {
          const { error } = await res.json()
          this.errorMessage = error
        }
      } catch {
        this.errorMessage = "Something went wrong"
      }

      this.loading = false
    },
    async setPassword() {
      this.loading = true

      try {
        const res = await fetch(`${process.env.VUE_APP_ADMIN_HOST || ""}/activateAccount`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activationToken: this.$route.query.activationToken,
            email: this.email,
            password: this.password,
          }),
        })

        if (res.ok) {
          this.success = true
        } else {
          const { error } = await res.json()
          this.errorMessage = error
        }
      } catch {
        this.errorMessage = "Something went wrong"
      }

      this.loading = false
    },
    toLogin() {
      this.$router.push({ name: "Auth" })
    },
  },
}
</script>
