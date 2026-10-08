<!-- Data collection opt-out dialog -->
    <!-- :scrim bound, not scrim="false": the bare attribute passes the string
         "false", which is truthy, so Vuetify dimmed the whole app behind it -->
<template>

  <v-card
    id="data-collection-card"
    density="compact"
    role="dialog"
    aria-modal="false"
    aria-labelledby="data-collection-notice-text"
    tabindex="-1"
  >
    <v-card-text id="data-collection-notice-text">
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
</template>

<script setup lang="ts">

const showPrivacyDialog = defineModel<boolean>('show', {default: false, required: true});
const showPrivacyPolicyInfo = defineModel<boolean>('showPrivacyPolicy',{default: false, required: true});
const responseOptOut = defineModel<boolean | null>('responseOptOut',{default: null, required: true});
</script>


<style lang="less">
#data-collection-card.v-card {
  font-size: 12px;
}
#data-collection-card.v-card .v-card-actions {
  display: flex;
  padding-top: 0em;
  padding-bottom: 0.5em;
  min-height: 0;
}

#data-collection-notice-text {
  padding-bottom: 0.5em;
  padding-inline: 1em;
}



#data-collection-card.v-card .v-btn {
  text-transform: none;
}


</style>