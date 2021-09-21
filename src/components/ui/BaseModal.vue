<template>
   <base-overlay dark transparent @click="this.$emit('clickout')"></base-overlay>
    <div class="base-modal">
      <slot></slot>
    </div>
</template>

<script>
export default {
emits: ['clickout']
}
</script>

<style>

</style>