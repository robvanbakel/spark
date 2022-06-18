<template>
  <div class="shift-block" :class="{ active: this.shift, proposed: this.shift && this.shift.status !== 'ACCEPTED' }">
    <div class="info-wrapper" v-if="this.shift">
      <div class="icons">
        <span v-for="icon in icons" :key="icon" class="material-symbols-outlined">{{icon}}</span>
      </div>
      <span class="location">{{ this.shift.location }}</span>
      <span class="time">
        {{ this.shift.from.format('HH:mm') }} - {{ this.shift.to.format('HH:mm') }}
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
  computed: {
    icons() {
      const icons = {
        description: this.shift?.notes,
        question_mark: this.shift?.status === 'PROPOSED',
      };

      return Object.keys(icons).filter((icon) => icons[icon]);
    },
  },
};
</script>
