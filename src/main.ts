import { createApp, type DirectiveBinding, type Plugin } from "vue";
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

/** v-hide directive taken from https://www.ryansouthgate.com/2020/01/30/vue-js-v-hide-element-whilst-keeping-occupied-space/ */
// Extract the function out, up here, so I'm not writing it twice
const update = (el: HTMLElement, binding: DirectiveBinding) => (el.style.visibility = binding.value ? "hidden" : "");

createApp(MainComponent, {
  wwtNamespace: "vue-ds-template",
})
  // Plugins
  .use(wwtPinia as unknown as Plugin<[]>)
  .use(vuetify)

  // global so components don't each need their own FontAwesomeIcon import
  .component("font-awesome-icon", FontAwesomeIcon)

  // Directives
  .directive(
    /**
     * Hides an HTML element, keeping the space it would have used if it were visible (css: Visibility)
     */
    "hide",
    {
      // Run on initialisation (first render) of the directive on the element
      beforeMount(el, binding, _vnode, _prevVnode) {
        update(el, binding);
      },
      // Run on subsequent updates to the value supplied to the directive
      updated(el, binding, _vnode, _prevVnode) {
        update(el, binding);
      },
    },
  )

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