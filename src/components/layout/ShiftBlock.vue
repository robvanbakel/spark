<template>
  <div
    class="shift-block"
    :class="[{ active: shift }, shift?.status.toLowerCase()]"
  >
    <div
      v-if="shift"
      class="info-wrapper"
    >
      <div class="icons">
        <span
          v-for="icon in icons"
          :key="icon"
          class="material-symbols-outlined"
        >{{ icon }}</span>
      </div>
      <span class="location">{{ shift.location }}</span>
      <span class="time">
        {{ shift.from.format('HH:mm') }} - {{ shift.to.format('HH:mm') }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    shift: {
      type: [Object, null],
      default: null,
    },
  },
  computed: {
    icons() {
      const icons = {
        description: this.shift?.notes,
        question_mark: this.shift?.status === 'PROPOSED',
        edit: this.shift?.status === 'DRAFT',
      };

      return Object.keys(icons).filter((icon) => icons[icon]);
    },
  },
};
</script>
