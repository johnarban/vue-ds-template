<template>
  <v-app
    id="app"
    :style="cssVars"
    :class="smallSize ? 'app-is-small' : ''"
  >
    <webgl-test @webgl2-disabled="showWebGL2Warning = true" />
    
    <!-- This contains the splash screen content -->
     
    <SplashScreen
      v-model="showSplashScreen"
      :color="accentColor"
      fullscreen-on-small
      @close="closeSplashScreen"
    >
      <div class="splash-content">
        <!-- the text styling comes through the a plain p-tag css selector 
          .splash-lead and .hightlight get larger fonts, and highlight gets accentColor
          -->
        <p class="splash-lead">Explore</p>
        <p class="highlight">the night sky</p>
        <p>&amp; let it inspire you to dare to do mighty things. it's reading rainbow</p>
      </div>
    </SplashScreen>
    
    <!-- This dialog contains the video that is displayed when the video icon is clicked -->
    <!-- 
      passing a youtube url to youtube-src instead will show a youtube video. 
      pass aspect= "wide" or "vertical" to force 16:9 (wide or vertical) aspect ratio. 
      -->
    <VideoWrapper
      v-model="showVideo"
    />


    <v-main>
      <div id="main-content">
        <WorldWideTelescope :wwt-namespace="wwtNamespace"></WorldWideTelescope>
        <wwt-loader v-model="isLoading" />

        <!-- This block contains the elements (e.g. icon buttons displayed at/near the top of the screen) -->

        <div v-show="!showSplashScreen" id="wwt-overlay">
        
          <div id="top-content">
            <div id="left-buttons">
              <!-- icon-buttons default to size="1em"
             id's and classes will be added to the .icon-wrapper
             it uses slotted styles so it's specificiy is (0,2,0)
              -->
              <icon-button
                icon="book-open"
                aria-label="Learn More"
                :color="accentColor"
                :focus-color="accentColor"
                tooltip-text="Learn More"
                tooltip-location="start"
                size="lg"
                @activate="() => openInfoSheetTab('information')"
              />
              <icon-button
                icon="question"
                aria-label="User guide"
                :color="accentColor"
                :focus-color="accentColor"
                tooltip-text="User guide"
                tooltip-location="start"
                size="lg"
                @activate="() => openInfoSheetTab('user-guide')"
              />
              <icon-button
                icon="mdi-shape-outline"
                aria-label="Example"
                :color="accentColor"
                :focus-color="accentColor"
                tooltip-text="Example"
                tooltip-location="start"
                size="lg"
                @activate="() => openInfoSheetTab('example')"
              />

              <icon-button
                v-model="showVideo"
                icon="video"
                aria-label="Watch video"
                :color="accentColor"
                :focus-color="accentColor"
                tooltip-text="Watch video"
                tooltip-location="start"
                size="lg"
              >
              </icon-button>
              <icon-button
                v-model="showTour"
                icon="signs-post"
                aria-label="Show Tour"
                :color="accentColor"
                :focus-color="accentColor"
                tooltip-text="Show Tour"
                tooltip-location="start"
                size="lg"
              />
            </div>
            <div id="center-buttons"></div>
            <div id="right-buttons">
              <ShareButton
                :source="urlState.getUrl"
                :tooltip="false"
              >
                <template #activator="activatorProps">
                  <icon-button
                    icon="share-nodes"
                    aria-label="Get link to share selected view"
                    :color="accentColor"
                    :focus-color="accentColor"
                    tooltip-text="Share"
                    tooltip-location="start"
                    size="lg"
                    :activator-props="activatorProps"
                  />
                </template>
              </ShareButton>
            </div>
          </div>

          <div id="bottom-content">
            <!-- Tab order lands here whether the tour is docked in the drawer right
                 below or floating out of it, so focus order doesn't jump around when
                 the layout switches between the two. -->
            <div id="tour-floating-location" />
            <!-- example: crossfade between the Hubble and JWST views of the Carina Nebula -->
            <image-crossfade-slider
              v-if="showTour && tour.stepID.value === 'carina' && hstCarina.imagesetLayer && jwstCarina.imagesetLayer"
              :left="hstCarina.imagesetLayer"
              :right="jwstCarina.imagesetLayer"
              left-label="Hubble"
              right-label="Webb"
              @mousedown="opacitySliderUses.increment()"
            />
          </div>
        </div>
      </div>
    </v-main>

    <!--
    This contains the informational content that is displayed when the book icon is clicked.
    It's an in-flow flex sibling of #main-content, so opening it shrinks the WWT view
    (from the side normally, from the bottom on small screens) instead of covering it.
  -->

    <!--
    the drawer pushes the view rather than covering it  to have it cover the view set temporary=true.
    By default Vuetify makes the drawer cover the view below a certain window width,
    no matter what temporary is set to. mobile-breakpoint=0 turns that off, so temporary
    is always respected.
    -->
    <v-navigation-drawer
      id="drawer"
      :key="sidePanel ? 'side' : 'bottom'"
      v-model="drawerOpen"
      tag="aside"
      aria-label="Information"
      :location="sidePanel ? 'start' : 'bottom'"
      :width="sidePanel ? drawerWidth : undefined"
      :mobile-breakpoint="0"
      :class="sidePanel ? 'drawer-side' : 'drawer-bottom'"
      :temporary="false"
    >
      <!-- disable=true for non-floating tour -->
      <!-- 
      Teleporting to the "body" places it last in the DOM so last in the tab-focus order.
      we actually want it pretty early, so instead of hacking a focus control, let's just put it where it belongs. 
      This won't help the case where we are in the v-navigation-drawer though
      -->
      <Teleport 
        to="#tour-floating-location" 
        defer
        :disabled="!floatingTour" 
      >
        <TourSheet
          v-if="showTour"
          v-focus-grab="showTour"
          tabindex="-1"
          :class="{'floating-tour': floatingTour}"
          :tour="tour"
          :small-size="false"
        />
      </Teleport>
      <!--
        The Tabbed Sheet and TabPage are vue "tightly coupled" components
        This means a TabPage can only be used within an TabbedSheet.
        The tab-page automatically registers itself as a tab in the information sheet, and unregisters itself when it is destroyed.

        v-model:tab is the name of the currently selected tab. It comes from the title in kebab-case or the value if specified
        Each tab must havea unique value. If the sheet is closed and you want to show a specific tab, you must set
        the showTextSheet to true and set the infoSheetTab to the value of the tab you want to show.
        
        Some available options are
        hide-tabs: (default: false) hide the tab bar, but keep space for the close button
        only-show-one: (default: false) only show the active tab, hide the others
        closable: (default: true) show the close button
      -->
      <tabbed-sheet
        v-show="showTextSheet"
        id="side-panel-sheet"
        v-model:tab="infoSheetTab"
        v-focus-toggle="showTextSheet"
        hide-tabs
        @close="showTextSheet = false"
      >
        <!-- tab-page content is wrapped in a .tab-page class  -->
        <tab-page title="Information">
          <!-- everything inside the tab-page is wrapped in a div with class "tab-page" -->
          <!-- we generally use heading level 3 (the same level as the tabs) -->
          <h3>Science Information</h3>
          <p>Sample Science Information</p>
        </tab-page>

        <!--
        Example of an Info Page with a stable footer and scrollable upper section.
        -->
        <tab-page title="Example" name="example">
          <div class="ip-example-header">[Optional] This will stay at the top</div>
          <div class="ip-example-body flex-grow-1 overflow-y-auto my-5" />
          <div class="ip-example-footer">This will stay at the bottom</div>
        </tab-page>

        <!-- the user guide is an <TabPage title="User Guide" value="user-guide>...</TabPage>"
         it can be userful to move complex content into a separate component
         -->
        <tab-page title="User Guide" value="user-guide">
          <user-guide @change-privacy-settings="showPrivacyPolicyInfo = true" />
        </tab-page>
      </tabbed-sheet>

      <!--
        You don't have to use the tabbed sheet though.
        If you would rather just have single sheets, controlled by their own button, or something else
        just use a v-sheet (provides the card colors) and make it a
        flex-column with 100% height.
      -->
      <!--
      <v-sheet
        v-if="showUserGuideSheet"
        v-focus-toggle="showUserGuideSheet"
        class="d-flex flex-column page-sheet"
        height="100%"
        tabindex="-1"
      >
        <div class="d-flex align-center justify-space-between pa-3">
          <h3>User Guide</h3>
          <close-button
            label="Close User Guide"
            color="primary"
            @click="showUserGuideSheet = false"
          />
        </div>
        <div class="page-sheet-body">
          <user-guide @change-privacy-settings="showPrivacyPolicyInfo = true" />
        </div>
      </v-sheet>
      -->
    </v-navigation-drawer>
    
    <!-- privacy setup -->
    <v-dialog
      id="data-collection-popup-dialog"
      v-model="showPrivacyDialog"
      :scrim="false"
      :persistent="true"
      width="320px"
      max-width="80vw"
      :capture-focus="false"
    >
      <DataCollectionOptOut
        v-model:show="showPrivacyDialog"
        v-model:show-privacy-policy="showPrivacyPolicyInfo"
        v-model:response-opt-out="responseOptOut"
      />
    </v-dialog>
    
    <v-dialog
      id="cds-privacy-policy"
      v-model="showPrivacyPolicyInfo"
      class="cds-privacy-policy__dialog"
      :scrim="false"
      max-width="400px"
      :capture-focus="false"
    >
      <CDSPrivacyPolicy
        v-model="showPrivacyPolicyInfo"
        v-model:response-opt-out="responseOptOut"
        v-model:gtag-consent="gtagConsent"
        v-focus-toggle="showPrivacyDialog"
        tabindex="-1"
      />
    </v-dialog>

    <!-- rating prompt, shown once a while after load (see useUserExperienceRating) -->
    <UserExperienceDialog
      :show-rating="showRatingDialog"
      :question="question"
      @dismiss="dismissRating"
      @rating="(rating) => updateUserExperienceInfo(rating, null)"
      @finish="(rating, comment) => {
        updateUserExperienceInfo(rating, comment);
        showRating = false;
      }"
      @opt-out="optOutRating"
      @what-is-this="showPrivacyPolicyInfo = true"
    />
    
    
    <!-- credit logos $logo-credits.cds-bottom-credits -->
    <!-- 
      we want this at the end of the DOM tree so that is last in tab order.
      but this also means it is highest in z-order, so if it appears on top of 
      something it should not. give that other thing a higher z-index.
      -->
    <credit-logos
      v-if="!xs"
      class="cds-bottom-credits"
      :default-logos="['cosmicds', 'wwt', 'nasa']"
      :logo-size="xs ? '1.5em' : '2em'"
      :extra-logos="extraLogos"
    />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { StyleValue } from "vue";
import { WWTControl, Coordinates } from "@wwtelescope/engine";
import { D2R } from "@wwtelescope/astro";
import { GotoRADecZoomParams, WWTComponent as WorldWideTelescope, engineStore } from "@wwtelescope/engine-pinia";
import {
  useWWTKeyboardControls,
  IconButton,
  CreditLogos,
  ShareButton,
} from "@cosmicds/vue-toolkit";

import { useAppLayout } from "./composables/useAppLayout";
import { useWtml } from "./composables/useWtmlLoader";

const extraLogos = [
  {
    src: "./CfA_Logo_Vertical_Reverse.png",
    href: "https://www.cfa.harvard.edu/",
    alt: "Center for Astrophysics | Harvard & Smithsonian Logo",
    name: "cfa",
  },
];

export interface MainComponentProps {
  wwtNamespace?: string;
}

const store = engineStore();

useWWTKeyboardControls(store);

// example of loading state.
import { useUrlState } from "./composables/useUrlState";
const urlState = useUrlState({ autoUpdate: true, inAddressBar: true, clearOnLoad: false });

// camera position in the url, in degrees. zoom is store.zoomDeg / 6 (vertical FOV convention).
import { refThrottled } from "@vueuse/core";
const raDeg = refThrottled(computed(() => (store.raRad * 180 / Math.PI).toFixed(4)), 500);
const decDeg = refThrottled(computed(() => (store.decRad * 180 / Math.PI).toFixed(4)), 500);
const zoom = refThrottled(computed(() => (store.zoomDeg / 6).toFixed(4)), 500);
urlState.track("ra", raDeg);
urlState.track("dec", decDeg);
urlState.track("zoom", zoom);

const { smallSize, sidePanel, floatingPanel: floatingTour, viewportWidth } = useAppLayout();
const DRAWER_WIDTH_FRACTION = 34; // 34% of the viewport width
const drawerWidth = computed(() => Math.round(viewportWidth.value * DRAWER_WIDTH_FRACTION / 100.));

withDefaults(defineProps<MainComponentProps>(), {
  wwtNamespace: "vue-ds-template",
});

const GALACTIC_CENTER = Coordinates.galactictoJ2000(0, 0);
const _initialCameraParams = (
  urlState.loadedFromUrl?.value.includes("ra")
    ? { raRad: parseFloat(raDeg.value) * D2R, decRad: parseFloat(decDeg.value) * D2R, zoomDeg: parseFloat(zoom.value) * 6 }
    : { raRad: GALACTIC_CENTER[0] * D2R, decRad: GALACTIC_CENTER[1] * D2R, zoomDeg: 360 }
) as Omit<GotoRADecZoomParams, "instant">;

const splash = new URLSearchParams(window.location.search).get("splash")?.toLowerCase() !== "false";
const showSplashScreen = ref(splash);

const showVideo = ref(false);

const showWebGL2Warning = ref(false);

const hstCarina = useWtml("https://web.wwtassets.org/specials/2023/cosmicds-carina/collection/carina_nebula.wtml", {
  single: true,
  goTo: false,
});

const jwstCarina = useWtml("https://web.wwtassets.org/specials/2023/cosmicds-carina/collection/jwst_carina.wtml", {
  single: true,
  goTo: false,
});


import { useTheme, useDisplay } from "vuetify";
const theme = useTheme();
// in the past we have used accentColor and accentColor2, but these serve the same purpose
// as vuetify's primary and secondary colors, so we tie them to that. vuetify components
// can access them directly as `color="primary" on the prop, and they are aleady available in the CSS as --v-theme-primary and --v-theme-secondary
const accentColor = computed(() => theme.current.value.colors.primary);
const accentColor2 = computed(() => theme.current.value.colors.secondary);

const { xs } = useDisplay();

import DataCollectionOptOut from "./privacy/DataCollectionOptOut.vue";
import CDSPrivacyPolicy from "./privacy/CDSPrivacyPolicy.vue";
import UserExperienceDialog from "./privacy/UserExperienceDialog.vue";
import { usePrivacy } from "./privacy/usePrivacy";
import { useUserExperienceRating } from "./privacy/useUserExperienceRating";
import { useGtagConsent } from "./privacy/useGtagConsent";
import { useCounter, useElapsedTime } from "./privacy/useDataCollection";

// opt-out by default (US-style); index.html's region-scoped defaults keep EU visitors opted out until they say otherwise
const gtagConsent = useGtagConsent(true);


/** app tracking setup */
const STORY_NAME = "vue-ds-template" as const;
const appTime = useElapsedTime(ref(true));
const opacitySliderUses = useCounter();

function resetTrackingData() {
  appTime.reset();
  userGuideTime.reset();
  opacitySliderUses.reset();
}

function getTrackingData() {
  return {
    app_time_ms: appTime.current(),
    user_guide_time_ms: userGuideTime.current(),
    opacity_slider_use_count: opacitySliderUses.count.value,
  };
}

const {
  createUserEntry,
  responseOptOut,
  userID,
  showPrivacyDialog,
  showPrivacyPolicyInfo,
  conditionalShowPrivacyDialog,
} = usePrivacy({
  optOutKey: `${STORY_NAME}:optOut`,
  userIDKey: `${STORY_NAME}:userID`,
  storyPath: `/${STORY_NAME}`,
  resetData: resetTrackingData,
  getData: getTrackingData,
});

watch(responseOptOut, (newVal) => {
  if (newVal === false) {
    gtagConsent.value = true;
  } else if (newVal === true) {
    gtagConsent.value = false;
  }
});

const {
  showRating,
  question,
  dismiss: dismissRating,
  optOut: optOutRating,
  updateUserExperienceInfo,
  initializePrompt,
} = useUserExperienceRating(STORY_NAME, userID, { responseOptOut, timeout: 2_000, });

// rating's timeout runs independently of the splash/privacy dialogs, so gate its visibility on both being done first
const showRatingDialog = computed(() => showRating.value && !showSplashScreen.value && !showPrivacyDialog.value);


const showTour = ref(false);

import {
  TourSheet,
  useTour,
  type BaseTourStepContent,
} from  "@cosmicds/vue-toolkit";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TourStepContent extends BaseTourStepContent {
  // add any additional properties you want to use in your tour steps here
}
const tour = useTour<TourStepContent>({
  /**
   * The first tour step contains a move. In this example file,
   * we had a move to the galactic center at startup and we had an
   * imageset layer that we goto. So tour step 1 got clobbered.
   * You either need to remove those early ones, or else make sure
   * tour.goToStep(0) get's called after everything is done. but be careful,
   * putting it in closeSplashScreen only works if the splash screen is shown.
   * 
   */
  steps: [
    {
      id: "crab",
      title: "Crab Nebula",
      text: ["Here's the Crab Nebula!"],
      setup: async () => {
        store.waitForReady().then(() => {
          store.gotoRADecZoom({
            raRad: 83.6331 * D2R, decRad: 22.0145 * D2R, zoomDeg: 1, instant: true,
          });
        });
      },
    },
    {
      id: "carina",
      title: "Carina Nebula",
      text: ["Here's the Carina Nebula! Use the slider to crossfade between Hubble and Webb images."],
      setup: async () => {
        store.waitForReady().then(() => {
          store.gotoRADecZoom({
            raRad: 159.230 * D2R, decRad: -58.650 * D2R, zoomDeg: 0.211, rollRad: 103.075 * D2R, instant: true,
          });
        });
      },
    },
    {
      id: "end",
      title: "The End",
      text: ["That's all folks!"],
    }
  ],
});
urlState.track("tour", tour.stepID);

function startTour() {
  showTour.value = true;
}

// urlState.track("step", tour.stepIndex);


onMounted(() => {
  if (showWebGL2Warning.value) {
    showSplashScreen.value = false;
    WWTControl.singleton.canvas.setAttribute("hidden", "true");
    WWTControl.singleton.renderOneFrame = function () {};
    return;
  }

  store.waitForReady().then(async () => {
    store.gotoRADecZoom({
      ..._initialCameraParams,
      instant: true,
    }).then(() => (positionSet.value = true));

    // If there are layers to set up, do that here!
    layersLoaded.value = true;

    createUserEntry();
    initializePrompt();
  });
});

const layersLoaded = ref(false);
const positionSet = ref(false);
const ready = computed(() => layersLoaded.value && positionSet.value);

/* `isLoading` is a bit redundant here, but it could potentially have independent logic */
const isLoading = computed(() => !ready.value);

// we do not need to add the accent colors anymore since they are availabe via the css theme
// but we use this to demonstrate the pattern.
/* This lets us inject component data into element CSS */
const cssVars = computed(() => {
  return {
    "--accent-color": accentColor.value,
    "--accent-color-2": accentColor2.value,
    "--drawer-width": `${DRAWER_WIDTH_FRACTION}vw`,
    "--drawer-bottom-height": "40vh",
    
  } as StyleValue;
});

/**
  Computed flags that control whether the relevant dialogs display.
  The `sheet` data member stores which sheet is open, so these are just
  computed wrappers around modifying/querying that which can be used as
  dialog v-model values
*/
const showTextSheet = ref(false);
const infoSheetTab = ref("");
const userGuideTime = useElapsedTime(computed(() => showTextSheet.value && infoSheetTab.value === "user-guide"));
/** open a tab on the info sheet */
function openInfoSheetTab(tabValue: string) {
  infoSheetTab.value = tabValue;
  showTextSheet.value = true;
  // we don't want both open at the same time
  showUserGuideSheet.value = false;
}
const showUserGuideSheet = ref(false);

const drawerOpen = computed({
  get: () => !showSplashScreen.value && (showTextSheet.value || showUserGuideSheet.value || (showTour.value && !floatingTour.value)),
  set: (open: boolean) => {
    if (!open) {
      showTextSheet.value = false;
      showUserGuideSheet.value = false;
      showTour.value = false;
    }
  },
});

/**
  This is convenient if there's any other logic that we want to run
  when the splash screen is closed
*/
function closeSplashScreen() {
  showSplashScreen.value = false;
  // has the user responsed the opt out, then show the privacy dialog
  // pass `true` to only show it once per session, even if the user does not respond (for example if it shows up after an intro sequence)
  conditionalShowPrivacyDialog();
  startTour();
}

import { mutuallyExclusive } from "./composables/utils";

// only one of the tour, text sheet, and user guide sheet can be open at a time
mutuallyExclusive(showTour, showTextSheet, showUserGuideSheet);
</script>

<style lang="less">
@import url(@/css/universal.css);
@import url(@/css/focus-visible.less);
:root {
  --default-font-size: clamp(0.7rem, 1.7vmin, 1.1rem);
  --default-line-height: clamp(1rem, 2.2vmin, 1.6rem);
}



html {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #000;
  overflow: hidden;

  -ms-overflow-style: none;
  // scrollbar-width: none;
}

body {
  position: fixed;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;

  font-family: Verdana, Arial, Helvetica, sans-serif;
}


#app {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  overscroll-behavior: none;
  font-size: 11pt;
}

#main-content {
  // containing block for the absolutely positioned WWT host and overlay.
  // v-main sizes this to the space the drawer leaves free.
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}


// WWT fills #main-content, which gets its size from the flex layout above.
// This breaks if #main-content stops having a definite size from layout.
.wwtelescope-component {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.wwtelescope-component > canvas {
  display: block;
}

// #wwt-overlay is positioned against #main-content, not the viewport
#wwt-overlay {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding-inline: 1rem;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  pointer-events: none;

  display: flex;
  flex-direction: column;
  justify-content: space-between; // pushes top and bottom content apart
}

#wwt-overlay > * {
  // turns each item in #wwt-overlay into a stacking context
  isolation: isolate;
}

#top-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

#left-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: auto;
}

#right-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
  height: auto;
  pointer-events: auto;
}

#bottom-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  pointer-events: auto;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;

}

// neither #logo-credits nor #icons-container are flex
#logo-credits.cds-bottom-credits {
  position: fixed;
  bottom: 0.5rem;
  right: 0.5rem;
}
#logo-credits.cds-bottom-credits > #icons-container {
  a {
    margin-inline: 0.3em;
  }
}

.icon-wrapper {
  // hack so that non-square icons don't look like ovals
  border-radius: 99999px !important;
  aspect-ratio: 1/1;
  // even padding
  padding: 8px !important;
}

.icon-wrapper.tonal {
  // tonal style
  background-color: rgba(var(--v-theme-primary), 0.4) !important;
  color: rgba(var(--v-theme-primary), 0.9) !important;
  border: none !important;
}

.icon-wrapper.tonal:hover {
  background-color: rgba(var(--v-theme-primary), 0.6) !important;
  color: rgba(var(--v-theme-primary), 1) !important;
}


// It needs to be a flex column so that the children can fill the height
#drawer .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
}

// Basic text styling for the TabbedSheet's content
// it is better to set in the main app than to set things in the component
// since the component may end up being imported from the toolkit. 
.cds-info-sheet .tab-page {
  h3 {
    color: steelblue;
  }

  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.page-sheet-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 0 1rem 1rem;
}

/* floats the tour: pulled out of the drawer (via Teleport) into #bottom-content's flex row, alongside e.g. the crossfade slider */
.floating-tour.tour-text {
  flex: 0 1 auto;
  width: 30vw;
  max-width: calc(100vw - 2rem);
  min-height: 0;
  max-height: 400px;
}

/* easier to just force it than wrestle with vuetify's built-in positioning */
#data-collection-popup-dialog > .v-overlay__content {
  position: fixed;
  top: auto;
  left: auto;
  right: 1rem;
  // keep above the icons
  bottom: 3.5rem;
  margin: 0;
  padding: 0;
}

.ip-example-body {
  height: 2000px;
  background: linear-gradient(to bottom, var(--accent-color), var(--accent-color-2));
}
</style>
