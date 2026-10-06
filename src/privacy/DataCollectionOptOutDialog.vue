<!-- Data collection opt-out dialog -->
    <!-- :scrim bound, not scrim="false": the bare attribute passes the string
         "false", which is truthy, so Vuetify dimmed the whole app behind it -->
<template>
  <v-dialog
    id="privacy-popup-dialog"
    v-model="showPrivacyDialog"
    :scrim="false"
    :persistent="true"
    width="320px"
    max-width="80vw"
  >
    <v-card
      density="compact"
      role="dialog"
      aria-modal="false"
      aria-labelledby="privacy-notice-text"
      tabindex="-1"
    >
      <v-card-text id="privacy-notice-text">
        To evaluate usage of this app, <strong>anonymized</strong> data may be collected.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="#BDBDBD"
          size="small"
          @click="showPrivacyPolicyInfo = true"
        >
          Privacy Policy
        </v-btn>
        <v-btn
          color="#ff6666"
          size="small"
          @click="() => {
            responseOptOut = true;
            showPrivacyDialog = false;
          }"
        >
          Opt out
        </v-btn>
        <!-- take  -->
        <v-btn
          v-focus-return="showPrivacyDialog"
          variant="tonal"
          size="small"
          color="green"
          @click="() => {
            responseOptOut = false;
            showPrivacyDialog = false;
          }"
        >
          Allow
        </v-btn>
        <!-- cancel is useful for testing -->
        <!-- <v-btn
          variant="tonal"
          size="small"
          color="yellow"
          @click="() => {
            showPrivacyDialog = false;
          }"
        >
          Cancel
        </v-btn> -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">

const showPrivacyDialog = defineModel<boolean>('show', {default: false, required: true});
const showPrivacyPolicyInfo = defineModel<boolean>('showPrivacyPolicy',{default: false, required: true});
const responseOptOut = defineModel<boolean | null>('responseOptOut',{default: null, required: true});
</script>


<style lang="less">
#privacy-popup-dialog {
  font-size: 12px;
}
#privacy-popup-dialog .v-card-actions {
  display: flex;
  padding-top: 0em;
  padding-bottom: 0.5em;
  min-height: 0;
}

#privacy-notice-text {
  padding-bottom: 0.5em;
  padding-inline: 1em;
}

/* easier to just force it than wrestle with vuetify's built-in positioning */
#privacy-popup-dialog > .v-overlay__content {
  position: fixed;
  top: auto;
  left: auto;
  right: 1rem;
  // keep above the icons
  bottom: 3.5rem;
  margin: 0;
  padding: 0;
}

#privacy-popup-dialog .v-btn {
  text-transform: none;
}


</style>