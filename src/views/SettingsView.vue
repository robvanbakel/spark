<script setup>
import {
  ref, onMounted, computed, watch,
} from 'vue';

import { useStore } from 'vuex';
import { onBeforeRouteLeave } from 'vue-router';

const store = useStore();

const settingsSaved = ref();
const confirmUnsavedChanges = ref();
const unsavedChanges = ref(null);
const settings = ref(store.getters['settings/settings']);

const dateNotations = computed(() => [
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
]);

const setDateNotation = (locale) => {
  settings.value.dateNotation = locale;
};

const saveSettings = async () => {
  store.dispatch('settings/saveSettings', settings.value);

  if (await settingsSaved.value.open()) {
    unsavedChanges.value = false;
  }
};

watch(settings.value, () => {
  unsavedChanges.value = true;
});

onMounted(() => {
  unsavedChanges.value = false;
});

onBeforeRouteLeave(async (to, from, next) => {
  if (!unsavedChanges.value) {
    next();
    return;
  }

  if (await confirmUnsavedChanges.value.open()) {
    saveSettings();
  }

  next();
});
</script>

<template>
  <section id="settings">
    <div class="header">
      <h1>{{ $t('settings.title') }}</h1>
      <div class="actions">
        <base-button
          :disabled="!unsavedChanges"
          icon="save"
          @click="saveSettings"
        >
          {{ $t('general.actions.save') }}
        </base-button>
      </div>
    </div>

    <div class="settings-group">
      <h2>{{ $t('settings.shareNotes.title') }}</h2>
      <p class="lead">
        {{ $t('settings.shareNotes.description') }}
      </p>
      <div class="setting toggle">
        <span class="label">{{ $t('settings.shareNotes.employeeNotes') }}</span>
        <BaseSwitch
          v-model="settings.shareWithEmployees.employeeNotes"
          toggle
        />
      </div>
      <div class="setting toggle">
        <span class="label">{{ $t('settings.shareNotes.shiftNotes') }}</span>
        <BaseSwitch
          v-model="settings.shareWithEmployees.shiftNotes"
          toggle
        />
      </div>
    </div>

    <div class="settings-group">
      <h2>{{ $t('settings.dateNotation.title') }}</h2>
      <div class="setting dropdown">
        <span class="label">{{ $t('settings.dateNotation.dateNotation') }}</span>
        <base-dropdown
          :items="dateNotations"
          :active="settings.dateNotation"
          @choice="setDateNotation"
        />
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
              id="street"
              v-model="settings.address.street"
              type="text"
              placeholder="street"
            >
          </div>
          <div class="input-row">
            <input
              id="postalCode"
              v-model="settings.address.postalCode"
              type="text"
              placeholder="ZIP Code"
            >
            <input
              id="city"
              v-model="settings.address.city"
              type="text"
              placeholder="City"
            >
          </div>
        </div>
      </div>
    </div>
  </section>

  <BaseConfirm
    ref="confirmUnsavedChanges"
    title="Unsaved Changes"
    message="Do you want to save your unsaved changes?"
    :choice-true="$t('general.actions.save', {resource: 'changes'})"
    :choice-false="$t('general.actions.discard')"
  />

  <BaseConfirm
    ref="settingsSaved"
    title="Success!"
    message="Your settings have been saved."
    choice-true="Ok"
    no-false
  />
</template>
