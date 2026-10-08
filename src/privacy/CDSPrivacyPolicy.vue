<template>
  <v-card
    class="cds-privacy-policy__card"
  >
    <div class="cds-privacy-policy__close">
      <CloseButton
        class="cds-privacy-policy__close-icon"
        label="Close privacy policy dialog"
        @click="showPrivacyDialog = false"
      />
    </div>
    <v-card-text class="cds-privacy-policy__text">
      <slot>
        <p>
          Your anonymous response will be used by the
          <a
            class="cds-privacy-policy__link"
            href="https://www.cosmicds.cfa.harvard.edu/"
            rel="noopener noreferrer external"
            target="_blank"
          >CosmicDS</a> team to improve the educational experience.
        </p>
        <p style="text-align: right; margin-top: 1em; font-size: 0.9em">
          <a
            href="https://cfa.harvard.edu/privacy-statement"
            rel="noopener noreferrer external"
            target="_blank"
          >Privacy Policy</a>
        </p>
      </slot>
    </v-card-text>

  </v-card>
</template>

<script setup lang="ts">
const showPrivacyDialog = defineModel<boolean>({default: false, required: true});

</script>

<style lang="css">
.cds-privacy-policy__card {
  font-size: 0.9em;
}
.cds-privacy-policy__close {
  display: inline-flex;
  justify-content: flex-end;
  margin: 0 0 0 auto;
}
.cds-privacy-policy__close-icon {
  margin-top: 0.25em;
  margin-right: 0.25em;
}

.cds-privacy-policy__card .cds-privacy-policy__text {
  margin: 0;
  padding-top: 0;
}

.cds-privacy-policy__link {
  font-weight: normal;
}
</style>
