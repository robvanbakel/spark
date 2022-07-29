<script setup>
import { ref } from 'vue';

import { useAuth, useSettings } from '@/store';

const authStore = useAuth();
const settingsStore = useSettings();

const errorMessage = ref(null);
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const showDemo = ref(false);
const demoLoading = ref(false);

const enterDemo = async () => {
  demoLoading.value = true;

  await authStore.login({
    email: 'demo@company.com',
    password: 'demo@company.com',
  });
};

setTimeout(() => {
  showDemo.value = true;
}, 650);

const handleSubmit = async () => {
  isLoading.value = true;

  const res = await authStore.login({
    email: email.value,
    password: password.value,
  });

  if (!res.user) {
    isLoading.value = false;

    switch (res.code) {
      case 'auth/user-not-found':
        errorMessage.value = 'User not found';
        break;
      case 'auth/wrong-password':
        errorMessage.value = 'Password incorrect';
        break;
      default:
        errorMessage.value = 'Login failed';
    }
  }
};
</script>

<template>
  <div class="auth-modal">
    <h1>Log In</h1>
    <p
      v-if="errorMessage"
      class="error"
    >
      {{ errorMessage }}
    </p>
    <form @submit.prevent="handleSubmit">
      <input
        v-model.trim="email"
        type="email"
        placeholder="Email"
        required
      >
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      >
      <base-button v-if="!isLoading">
        Log In
      </base-button>
      <base-button
        v-else
        disabled
      >
        Loading…
      </base-button>
    </form>
  </div>

  <div v-if="settingsStore.mode === 'demo' || settingsStore.mode === 'localhost'">
    <transition name="demo">
      <div
        v-if="showDemo"
        class="auth-modal demo"
      >
        <h1>No account yet?</h1>
        <p>
          Click the button below to enter a demo account. Any changes you make won't be stored and
          will be lost when existing the demo environment.
        </p>
        <base-button
          v-if="!demoLoading"
          icon="login"
          @click="enterDemo"
        >
          Enter Demo
        </base-button>
        <base-button
          v-else
          disabled
          icon="login"
        >
          Loading…
        </base-button>
      </div>
    </transition>
  </div>
</template>

<style>
.demo-enter-from {
  transform: translateY(16px);
  opacity: 0;
}

.demo-enter-active {
  transition: all 500ms ease-out;
}
</style>
