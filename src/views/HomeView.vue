<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "@/store";

const router = useRouter();
const authStore = useAuth();

if (authStore.isAdmin) {
  router.replace({ name: "EmployeeList" });
} else {
  router.replace({ name: "Schedule" });
}
</script>

<template>
  <div />
</template>
