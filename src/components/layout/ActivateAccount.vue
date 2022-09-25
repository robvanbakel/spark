<script setup lang="ts">
import { ref, watch, nextTick } from "vue";

import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const passwordField = ref();
const repeatPasswordField = ref();
const errorMessage = ref(null);
const emailConfirmed = ref(false);
const loading = ref(false);
const firstName = ref(null);
const success = ref(false);
const email = ref("");
const password = ref("");
const repeatPassword = ref("");

watch(emailConfirmed, (val) => {
  if (val) {
    nextTick(() => {
      passwordField.value.focus();
    });
  }
});

const confirmEmail = async () => {
  loading.value = true;

  const baseUrl = `${import.meta.env.VITE_ADMIN_HOST || ""}/admin/activateAccount`;

  const { activationToken } = route.query;
  const encodedEmail = encodeURIComponent(email.value);

  try {
    const res = await fetch(`${baseUrl}?activationToken=${activationToken}&email=${encodedEmail}`);

    if (res.ok) {
      const data = await res.json();
      emailConfirmed.value = true;

      firstName.value = data.firstName;
      errorMessage.value = null;
    } else {
      const { error } = await res.json();
      errorMessage.value = error;
    }
  } catch {
    errorMessage.value = "Something went wrong";
  }

  loading.value = false;
};

const resetPasswordFields = () => {
  password.value = "";
  repeatPassword.value = "";
  passwordField.value.focus();
};

const setPassword = async () => {
  // Validate if password field is empty
  if (!password.value) {
    errorMessage.value = "Please choose a password";
    resetPasswordFields();
    return;
  }

  // Validate if passwords is long enough
  if (password.value.length < 6) {
    errorMessage.value = "Please choose a longer password";
    resetPasswordFields();
    return;
  }

  // Validate repeatPassword field is empty
  if (password.value && !repeatPassword.value) {
    errorMessage.value = "Please repeat your password";
    repeatPasswordField.value.focus();
    return;
  }

  // Check if passwords match
  if (password.value !== repeatPassword.value) {
    errorMessage.value = "Passwords do not match";
    resetPasswordFields();
    return;
  }

  loading.value = true;
  errorMessage.value = null;

  try {
    const res = await fetch(`${import.meta.env.VITE_ADMIN_HOST || ""}/admin/activateAccount`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activationToken: route.query.activationToken,
        email: email.value,
        password: password.value,
      }),
    });

    if (res.ok) {
      success.value = true;
    } else {
      const { error } = await res.json();
      errorMessage.value = error;
    }
  } catch {
    errorMessage.value = "Something went wrong";
  }

  loading.value = false;
};

const toLogin = () => {
  router.push({ name: "Auth" });
};
</script>

<template>
  <div v-if="!success">
    <div v-if="!emailConfirmed" class="auth-modal">
      <h1>Welcome</h1>
      <p>Please enter your email address and click continue to choose a password.</p>
      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
      <form @submit.prevent="confirmEmail">
        <input
          ref="emailField"
          v-model.trim="email"
          type="email"
          placeholder="Email"
          required
          autofocus
        />
        <base-button v-if="!loading" type="submit"> Continue </base-button>
        <base-button v-else disabled> Loading… </base-button>
      </form>
    </div>

    <div v-else class="auth-modal">
      <h1>Hi {{ firstName }}</h1>
      <p>
        Choose a strong password and submit in order to activate your account and login to see your
        schedule.
      </p>
      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
      <form @submit.prevent="setPassword">
        <input ref="passwordField" v-model="password" type="password" placeholder="Password" />
        <input
          ref="repeatPasswordField"
          v-model="repeatPassword"
          type="password"
          placeholder="Repeat password"
        />
        <base-button v-if="!loading" type="submit"> Activate Account </base-button>
        <base-button v-else disabled> Loading… </base-button>
      </form>
    </div>
  </div>

  <div v-else class="auth-modal success">
    <h1>Success!</h1>
    <p>
      Your account has been successfully activated! You can now log in to Spark to see your
      schedule.
    </p>
    <base-button icon="login" @click="toLogin"> Login page </base-button>
  </div>
</template>
