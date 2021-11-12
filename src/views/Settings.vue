<template>
  <section id="settings">
    <div class="header">
      <h1>Settings</h1>
      <div class="actions">
        <base-button @click="saveSettings" :disabled="!unsavedChanges" icon="save">Save</base-button>
      </div>
    </div>

    <div class="settings-group">
      <h2>Share notes with employees</h2>
      <p class="lead">
        Control whether or not employees have access to notes made by the planners. If enabled, all notes associated
        with an employee will immediately become visible to them.
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
    </div>

    <div class="settings-group">
      <h2>Date notation</h2>
      <div class="setting dropdown">
        <span class="label">Date notation</span>
        <base-dropdown
          :items="dateNotations"
          :active="$store.getters['settings/dateNotation']"
          @choice="setDateNotation"
        ></base-dropdown>
      </div>
    </div>
  </section>

  <base-confirm
    ref="confirmUnsavedChanges"
    title="Unsaved Changes"
    message="Do you want to save your unsaved changes?"
    choiceTrue="Save changes"
    choiceFalse="Discard"
  ></base-confirm>

  <base-confirm
    ref="settingsSaved"
    title="Success!"
    message="Your settings have been saved."
    choiceTrue="Ok"
    noFalse
  ></base-confirm>
</template>

<script>
export default {
  data() {
    return {
      unsavedChanges: null,
      shareWithEmployees: {
        employeeNotes: null,
        shiftNotes: null,
      },
      dateNotation: null,
    }
  },
  methods: {
    setShareWithEmployees(value, id) {
      this.unsavedChanges = true
      this.shareWithEmployees[id] = value
    },
    setDateNotation(locale) {
      this.unsavedChanges = true
      this.dateNotation = locale
    },
    async saveSettings() {
      this.$store.dispatch("settings/setShareWithEmployees", this.shareWithEmployees)
      this.$store.dispatch("settings/dateNotation", this.dateNotation)

      if (await this.$refs.settingsSaved.open()) {
        this.unsavedChanges = false
      }
    },
  },
  computed: {
    dateNotations() {
      return [
        {
          id: "en-US",
          display: "MM/DD/YYYY",
        },
        {
          id: "en-GB",
          display: "DD/MM/YYYY",
        },
        {
          id: "nl-NL",
          display: "DD-MM-YYYY",
        },
      ]
    },
  },
  mounted() {
    this.unsavedChanges = false
  },
  async beforeRouteLeave(to, from, next) {
    if (!this.unsavedChanges) {
      next()
    } else {
      if (await this.$refs.confirmUnsavedChanges.open()) {
        this.saveSettings()
      }
      next()
    }
  },
}
</script>

<style></style>
