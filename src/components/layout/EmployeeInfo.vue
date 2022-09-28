<script setup>
import { computed } from "vue";

import { useAuth } from "@/store";

const authStore = useAuth();

const user = computed(() => authStore.user);
</script>

<template>
  <div class="employee-info-wrapper">
    <h3>{{ $t("schedule.profile") }}</h3>
    <h4>{{ $t("general.labels.name") }}</h4>
    <p>{{ user.firstName }} {{ user.lastName }}</p>
    <h4>{{ $t("general.labels.role") }}</h4>
    <p>{{ user.role }}</p>
    <h4>{{ $t("general.labels.contract") }}</h4>
    <p>
      {{ user.contract }} {{ $t("schedule.hours") }} ({{ user.contractType }})
    </p>
    <h4>{{ $t("general.labels.email") }}</h4>
    <p>{{ user.email }}</p>
    <h4>{{ $t("general.labels.phone") }}</h4>
    <p>{{ user.phone }}</p>
    <div v-if="user.notes">
      <h4>{{ $t("general.labels.notes") }}</h4>
      <p>{{ user.notes }}</p>
    </div>
  </div>
</template>
