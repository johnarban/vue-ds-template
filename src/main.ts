import { createApp, type Plugin } from "vue";
import vuetify from "./plugins/vuetify";

/* import the toolkit css first so that it can be easily overridden */
import "@cosmicds/vue-toolkit/dist/vue-toolkit.css";

import MainComponent from "./MainComponent.vue";

import { wwtPinia } from "@wwtelescope/engine-pinia";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBookOpen,
  faTimes,
  faVideo,
  faQuestion,
  faSliders,
  faShareNodes,
  faLightbulb,
  faSignsPost,
  faHouse,
  faXmark,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

library.add(faBookOpen);
library.add(faTimes);
library.add(faVideo);
library.add(faQuestion);
library.add(faSliders);
library.add(faShareNodes);
library.add(faLightbulb);
library.add(faSignsPost);
library.add(faHouse);
library.add(faXmark);
library.add(faImage);

import hide from "./directives/hide";
import focusReturn from "./directives/focusReturn";
createApp(MainComponent, {
  wwtNamespace: "vue-ds-template",
})
  // Plugins
  .use(wwtPinia as unknown as Plugin<[]>)
  .use(vuetify)

  // global so components don't each need their own FontAwesomeIcon import
  .component("font-awesome-icon", FontAwesomeIcon)

  // Directives
  .directive( "hide", hide)
  .directive("focus-return", focusReturn)

  // Mount
  .mount("#app-mount");

  
  

// https://david-gilbertson.medium.com/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2
// apparently quite the old problem.
window.addEventListener('keydown', e => { // text inputs always match :focus-visible, so track tab navigation ourselves
  if (e.key === 'Tab') document.documentElement.dataset.focusSource = 'keyboard';
}, true);
window.addEventListener('pointerdown', () => {
  document.documentElement.dataset.focusSource = 'pointer';
}, true);