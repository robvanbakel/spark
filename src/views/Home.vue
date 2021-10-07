<template>
  <div>
    <p v-for="(week, index) in $store.getters['planner/schedules']" :key="index">{{ index }}</p>
  </div>
</template>

<script>
export default {}
</script>
