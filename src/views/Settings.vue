<template>
  <section id="settings">
    <div class="header">
      <h1>Settings</h1>
      <div class="actions">
        <base-button @click="saveSettings" icon="save">Save</base-button>
      </div>
    </div>

    <div class="settings-group">
      <h2>Share with employees</h2>
      <div class="setting toggle">
        <span class="label">Shift Notes</span>
        <base-switch
          toggle
          id="shiftNotes"
          :active="$store.getters['settings/shareWithEmployees'].shiftNotes.toString()"
          @activeItem="setShareWithEmployees($event, 'shiftNotes')"
        ></base-switch>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      shareWithEmployees: {
        shiftNotes: null,
      }
    }
  },
  methods: {
    setShareWithEmployees(value, id) {
      this.shareWithEmployees[id] = value
    },
    saveSettings() {
     this.$store.dispatch('settings/setShareWithEmployees', this.shareWithEmployees)
    }
  },
}
</script>

<style></style>
