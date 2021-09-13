<template>
  <PlannerRow v-for="role in this.roles" :key="role" :role="role" :search="search" />
</template>

<script>
import PlannerRow from "@/components/layout/PlannerRow"

export default {
  props: ["roles", "search"],
  components: { PlannerRow },
}
</script>
