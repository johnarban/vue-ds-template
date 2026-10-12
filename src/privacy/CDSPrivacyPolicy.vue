<template>
  <v-card
    class="cds-privacy-policy__card"
  >
    <div class="cds-privacy-policy__close">
      <h2>Privacy Policy</h2>
      <CloseButton
        class="cds-privacy-policy__close-icon"
        label="Close privacy policy dialog"
        @click="showPrivacyDialog = false"
      />
    </div>
    <v-card-text class="cds-privacy-policy__text">
      <slot>
        <p class="cds-privacy-policy__top-text">
          Cosmic Data Stories collects anonymous usage data to understand and innovate educational experiences.
          We collect no personally identifiable information and do not track users across other sites.
        </p>

        <v-divider class="my-2" />
        <div class="cds-privacy-policy__options">
          <p>
            We use Google Analytics to collect anonymous site analytics (page views, time on page, etc).
            We do not collect any advertising data. 
            <br />
            <a
              class="cds-privacy-policy__ga-link"
              href="https://tools.google.com/dlpage/gaoptout?hl=en"
              rel="noopener noreferrer external"
              target="_blank"
            >Opt out of Google Analytics Cookies</a>.
          </p>

          <div class="d-flex flex-column mt-4">
            <details class="cds-privacy-policy__details">
              <summary>Allow anonymized app usage data collection?</summary>
              <p class="pl-1">
                This includes how long the app is open, which features are used, buttons clicked, etc.
                None of the data is personally identifiable, and is only seen and used by the Cosmic Data Stories team to
                to understand and evaluate the app expeience, learning goals, and to improve the app.
              </p>
            </details>
            <v-btn-toggle
              v-model="responseOptOut"
              class="align-self-center mt-2 ga-1"
              mandatory
              size="small"
              variant="tonal"
            >
              <v-btn
                :value="false"
                color="green"
                :prepend-icon="!responseOptOut ? 'mdi-check-circle' : ''"
              >Allow</v-btn>
              <v-btn
                :value="true"
                color="red"
                :append-icon="responseOptOut ? 'mdi-check-circle' : ''"
              >Opt-Out</v-btn>
            </v-btn-toggle>
          </div>
          <p style="text-align: center; font-weight: bold; margin-top: 2em">
            Read our full 
            <a
              href="https://cfa.harvard.edu/privacy-statement"
              rel="noopener noreferrer external"
              target="_blank"
            >Privacy Policy</a>
          </p>
        </div>
        
      </slot>
    </v-card-text>

  </v-card>
</template>

<script setup lang="ts">
const showPrivacyDialog = defineModel<boolean>({default: false, required: true});
const responseOptOut = defineModel<boolean | null>("responseOptOut", {default: null, required: true});
// for now we are doing nothing with this, 
// const gaConsent = defineModel<boolean>("gtagConsent", {default: false, required: true});

</script>

<style lang="css">
.cds-privacy-policy__card {
  font-size: 0.8em;
  line-height: 1.4em;
}
.cds-privacy-policy__close {
  display: inline-flex;
  justify-content: space-between;
  padding: 0.5em;
  color: rgb(var(--v-theme-primary))
}

.cds-privacy-policy__close h2 {
  font-size: 1.2em;
  margin-inline: 1rem;
  margin-top: 0.5em;
}
.cds-privacy-policy__close-icon {
  margin-top: 0.25em;
  margin-right: 0.25em;
}

.cds-privacy-policy__top-text {
  font-size: 1.05em;
}

.cds-privacy-policy__options {
 font-size: 0.95em;
  line-height: 1.4em;
}

.cds-privacy-policy__options .v-btn-toggle .v-btn {
  font-size: 0.9em;
}
.cds-privacy-policy__options .v-btn-toggle .v-btn.v-btn--active {
  font-weight: bold;
}

.cds-privacy-policy__details {
  margin: 0;
}
.cds-privacy-policy__details summary {
  cursor: pointer;
  border-radius: 4px;
  padding-inline: 1em;
  font-size: 1.1em;
  margin-inline: -1em;
}
.cds-privacy-policy__details p {
  margin: 0.25em 0 0;
  font-size: 0.95em;
}

.v-card.cds-privacy-policy__card .v-card-text.cds-privacy-policy__text {
  margin: 0;
  padding-top: 1em;
}

.cds-privacy-policy__ga-link {
  font-weight: normal;
  display: inline-block;
  margin-top: 0.3em;
  margin-left: 1em;
  
}
.cds-privacy-policy__ga-link::after {
  content: "\F2370\F2370\F2370\F2370\F2370\F2370\F2370\F03CC";
  font: 24px "Material Design Icons";
  font-size: 0.8em;
}
</style>
