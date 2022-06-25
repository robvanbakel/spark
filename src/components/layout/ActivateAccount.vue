<template>
  <div v-if="!success">
    <div
      v-if="!emailConfirmed"
      class="auth-modal"
    >
      <h1>Welcome</h1>
      <p>Please enter your email address and click continue to choose a password.</p>
      <p
        v-if="errorMessage"
        class="error"
      >
        {{ errorMessage }}
      </p>
      <form @submit.prevent="confirmEmail">
        <input
          ref="email"
          v-model.trim="email"
          type="email"
          placeholder="Email"
          required
          autofocus
        >
        <base-button
          v-if="!loading"
          type="submit"
        >
          Continue
        </base-button>
        <base-button
          v-else
          disabled
        >
          Loading…
        </base-button>
      </form>
    </div>

    <div
      v-else
      class="auth-modal"
    >
      <h1>Hi {{ firstName }}</h1>
      <p>Choose a strong password and submit in order to activate your account and login to see your schedule.</p>
      <p
        v-if="errorMessage"
        class="error"
      >
        {{ errorMessage }}
      </p>
      <form @submit.prevent="setPassword">
        <input
          ref="password"
          v-model="password"
          type="password"
          placeholder="Password"
        >
        <input
          ref="repeatPassword"
          v-model="repeatPassword"
          type="password"
          placeholder="Repeat password"
        >
        <base-button
          v-if="!loading"
          type="submit"
        >
          Activate Account
        </base-button>
        <base-button
          v-else
          disabled
        >
          Loading…
        </base-button>
      </form>
    </div>
  </div>

  <div
    v-else
    class="auth-modal success"
  >
    <h1>Success!</h1>
    <p>Your account has been successfully activated! You can now log in to Spark to see your schedule.</p>
    <base-button
      icon="login"
      @click="toLogin"
    >
      Login page
    </base-button>
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
      email: '',
      password: '',
      repeatPassword: '',
    };
  },
  watch: {
    emailConfirmed(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.password.focus();
        });
      }
    },
  },
  methods: {
    async confirmEmail() {
      this.loading = true;

      const baseUrl = `${import.meta.env.VITE_ADMIN_HOST || ''}/admin/activateAccount`;

      const { activationToken } = this.$route.query;
      const email = encodeURIComponent(this.email);

      try {
        const res = await fetch(`${baseUrl}?activationToken=${activationToken}&email=${email}`);

        if (res.ok) {
          const { firstName } = await res.json();
          this.emailConfirmed = true;

          this.firstName = firstName;
          this.errorMessage = null;
        } else {
          const { error } = await res.json();
          this.errorMessage = error;
        }
      } catch {
        this.errorMessage = 'Something went wrong';
      }

      this.loading = false;
    },
    resetPasswordFields() {
      this.password = '';
      this.repeatPassword = '';
      this.$refs.password.focus();
    },
    async setPassword() {
      // Validate if password field is empty
      if (!this.password) {
        this.errorMessage = 'Please choose a password';
        this.resetPasswordFields();
        return;
      }

      // Validate if passwords is long enough
      if (this.password.length < 6) {
        this.errorMessage = 'Please choose a longer password';
        this.resetPasswordFields();
        return;
      }

      // Validate repeatPassword field is empty
      if (this.password && !this.repeatPassword) {
        this.errorMessage = 'Please repeat your password';
        this.$refs.repeatPassword.focus();
        return;
      }

      // Check if passwords match
      if (this.password !== this.repeatPassword) {
        this.errorMessage = 'Passwords do not match';
        this.resetPasswordFields();
        return;
      }

      this.loading = true;
      this.errorMessage = null;

      try {
        const res = await fetch(`${import.meta.env.VITE_ADMIN_HOST || ''}/admin/activateAccount`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activationToken: this.$route.query.activationToken,
            email: this.email,
            password: this.password,
          }),
        });

        if (res.ok) {
          this.success = true;
        } else {
          const { error } = await res.json();
          this.errorMessage = error;
        }
      } catch {
        this.errorMessage = 'Something went wrong';
      }

      this.loading = false;
    },
    toLogin() {
      this.$router.push({ name: 'Auth' });
    },
  },
};
</script>
