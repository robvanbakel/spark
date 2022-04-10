<template>
  <section id="settings">
    <div class="header">
      <h1>{{ $t('settings.title') }}</h1>
      <div class="actions">
        <base-button @click="saveSettings" :disabled="!unsavedChanges" icon="save">{{ $t('general.actions.save') }}</base-button>
      </div>
    </div>

    <div class="settings-group">
      <h2>{{ $t('settings.shareNotes.title') }}</h2>
      <p class="lead">
        {{ $t('settings.shareNotes.description') }}
      </p>
      <div class="setting toggle">
        <span class="label">{{ $t('settings.shareNotes.employeeNotes') }}</span>
        <base-switch
          toggle
          id="employeeNotes"
          :active="$store.getters['settings/shareWithEmployees'].employeeNotes.toString()"
          @activeItem="setShareWithEmployees($event, 'employeeNotes')"
        ></base-switch>
      </div>
      <div class="setting toggle">
        <span class="label">{{ $t('settings.shareNotes.shiftNotes') }}</span>
        <base-switch
          toggle
          id="shiftNotes"
          :active="$store.getters['settings/shareWithEmployees'].shiftNotes.toString()"
          @activeItem="setShareWithEmployees($event, 'shiftNotes')"
        ></base-switch>
      </div>
    </div>

    <div class="settings-group">
      <h2>{{ $t('settings.dateNotation.title') }}</h2>
      <div class="setting dropdown">
        <span class="label">{{ $t('settings.dateNotation.dateNotation') }}</span>
        <base-dropdown
          :items="dateNotations"
          :active="$store.getters['settings/dateNotation']"
          @choice="setDateNotation"
        ></base-dropdown>
      </div>
    </div>

    <div class="settings-group">
      <h2>{{ $t('settings.address.title') }}</h2>
      <p class="lead">
        {{ $t('settings.address.description') }}
      </p>
      <div class="setting address">
        <span class="label">{{ $t('settings.address.address') }}</span>
        <div class="input-wrapper">
          <div class="input-row">
            <input
              id="address"
              type="text"
              placeholder="Address"
              v-model="location.address"
              @input="this.unsavedChanges = true"
            />
          </div>
          <div class="input-row">
            <input
              id="postalCode"
              type="text"
              placeholder="ZIP Code"
              v-model="location.postalCode"
              @input="this.unsavedChanges = true"
            />
            <input
              id="city"
              type="text"
              placeholder="City"
              v-model="location.city"
              @input="this.unsavedChanges = true"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <BaseConfirm
    ref="confirmUnsavedChanges"
    title="Unsaved Changes"
    message="Do you want to save your unsaved changes?"
    :choiceTrue="$t('general.actions.save', {resource: 'changes'})"
    :choiceFalse="$t('general.actions.discard')"
  />

  <BaseConfirm
    ref="settingsSaved"
    title="Success!"
    message="Your settings have been saved."
    choiceTrue="Ok"
    noFalse
  />
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
      location: this.$store.getters['settings/location'],
      dateNotation: this.$store.getters['settings/dateNotation'],
    };
  },
  methods: {
    setShareWithEmployees(value, id) {
      this.unsavedChanges = true;
      this.shareWithEmployees[id] = value;
    },
    setDateNotation(locale) {
      this.unsavedChanges = true;
      this.dateNotation = locale;
    },
    async saveSettings() {
      this.$store.dispatch('settings/setShareWithEmployees', this.shareWithEmployees);
      this.$store.dispatch('settings/dateNotation', this.dateNotation);
      this.$store.dispatch('settings/location', this.location);

      if (await this.$refs.settingsSaved.open()) {
        this.unsavedChanges = false;
      }
    },
  },
  computed: {
    dateNotations() {
      return [
        {
          id: 'MM/DD/YYYY',
          display: 'MM/DD/YYYY',
        },
        {
          id: 'DD/MM/YYYY',
          display: 'DD/MM/YYYY',
        },
        {
          id: 'DD-MM-YYYY',
          display: 'DD-MM-YYYY',
        },
      ];
    },
  },
  mounted() {
    this.unsavedChanges = false;
  },
  async beforeRouteLeave(to, from, next) {
    if (!this.unsavedChanges) {
      next();
    } else {
      if (await this.$refs.confirmUnsavedChanges.open()) {
        this.saveSettings();
      }
      next();
    }
  },
};
</script>
