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
      <p class="lead">
        Control whether or not employees have access to notes made by the planners. If enabled, all notes associated with an employee will immediately become
        visible to them.
      </p>
      <div class="setting toggle">
        <span class="label">Employee Notes</span>
        <base-switch
          toggle
          id="employeeNotes"
          :active="$store.getters['settings/shareWithEmployees'].employeeNotes.toString()"
          @activeItem="setShareWithEmployees($event, 'employeeNotes')"
        ></base-switch>
      </div>
      <div class="setting toggle">
        <span class="label">Shift Notes</span>
        <base-switch
          toggle
          id="shiftNotes"
          :active="$store.getters['settings/shareWithEmployees'].shiftNotes.toString()"
          @activeItem="setShareWithEmployees($event, 'shiftNotes')"
        ></base-switch>
      </div>
      <p class="note">Changes may take up to one hour to take effect.</p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      shareWithEmployees: {
        employeeNotes: null,
        shiftNotes: null,
      },
    }
  },
  methods: {
    setShareWithEmployees(value, id) {
      this.shareWithEmployees[id] = value
    },
    saveSettings() {
      this.$store.dispatch("settings/setShareWithEmployees", this.shareWithEmployees)
    },
  },
}
</script>

<style></style>
