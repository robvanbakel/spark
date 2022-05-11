<template>
  <div class="shift-block" :class="{ active: this.shift, proposed: this.shift && this.shift.status !== 'ACCEPTED' }">
    <div class="info-wrapper" v-if="this.shift" >
      <div class="shift-info-header">
        <span class="location">{{ this.shift.location }}</span>
        <span class="notes material-icons material-icons-round" v-if="this.shift.notes && this.shift.accepted">description</span>
      </div>
      <span class="time">
        {{ $dayjs(this.shift.from).format('HH:mm') }} - {{ $dayjs(this.shift.to).format('HH:mm') }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    shift: {
      type: Object,
    },
  },
};
</script>
