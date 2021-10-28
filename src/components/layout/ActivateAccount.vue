<template>
  <div v-if="!success">
    <div class="auth-modal" v-if="!emailConfirmed">
      <h1>Welcome</h1>
      <p>Please enter your email address and click continue to choose a password.</p>
      <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
      <form @submit.prevent="confirmEmail">
        <input type="email" placeholder="Email" required v-model.trim="email" ref="email" autofocus />
        <base-button v-if="!loading" type="submit">Continue</base-button>
        <base-button v-else disabled>Loading…</base-button>
      </form>
    </div>

    <div class="auth-modal" v-else>
      <h1>Hi {{ firstName }}</h1>
      <p>Choose a strong password and submit in order to activate your account and login to see your schedule.</p>
      <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
      <form @submit.prevent="setPassword">
        <input type="password" placeholder="Password" v-model="password" ref="password" />
        <input type="password" placeholder="Repeat password" v-model="repeatPassword" ref="repeatPassword" />
        <base-button v-if="!loading" type="submit">Activate Account</base-button>
        <base-button v-else disabled>Loading…</base-button>
      </form>
    </div>
  </div>

  <div class="auth-modal success" v-else>
    <h1>Success!</h1>
    <p>Your account has been successfully activated! You can now log in to Spark to see your schedule.</p>
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

      const baseUrl = `${process.env.VUE_APP_ADMIN_HOST || ""}/admin/activateAccount`

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
    resetPasswordFields() {
      this.password = ""
      this.repeatPassword = ""
      this.$refs.password.focus()
    },
    async setPassword() {
      // Validate if password field is empty
      if (!this.password) {
        this.errorMessage = "Please choose a password"
        this.resetPasswordFields()
        return
      }

      // Validate if passwords is long enough
      if (this.password.length < 6) {
        this.errorMessage = "Please choose a longer password"
        this.resetPasswordFields()
        return
      }

      // Validate repeatPassword field is empty
      if (this.password && !this.repeatPassword) {
        this.errorMessage = "Please repeat your password"
        this.$refs.repeatPassword.focus()
        return
      }

      // Check if passwords match
      if (this.password !== this.repeatPassword) {
        this.errorMessage = "Passwords do not match"
        this.resetPasswordFields()
        return
      }

      this.loading = true
      this.errorMessage = null

      try {
        const res = await fetch(`${process.env.VUE_APP_ADMIN_HOST || ""}/admin/activateAccount`, {
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
  watch: {
    emailConfirmed(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      }
    },
  },
}
</script>
