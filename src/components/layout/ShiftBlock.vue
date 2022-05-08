<template>
  <div class="shift-block" :class="{ active: shift, proposed: shift && shift.status !== 'ACCEPTED' }">
    <div class="info-wrapper" v-if="shift" >
      <div class="shift-info-header">
        <span class="location">{{ shift.location }}</span>
        <span class="notes material-icons material-icons-round" v-if="shift.notes && shift.accepted">description</span>
      </div>
      <span class="time">
        {{ $dayjs(shift.from).format('HH:mm') }} - {{ $dayjs(shift.to).format('HH:mm') }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    shiftId: {
      type: String,
    },
  },
  computed: {
    shift() {
      return this.$store.getters['planner/shifts'].find((shift) => shift.shiftId === this.shiftId);
    },
  },
};
</script>

<style>

</style>
