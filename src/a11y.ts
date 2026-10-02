/**
 * Accessibility (a11y) related helpers and utilities
 */


import type { Ref } from 'vue';
import { watch, nextTick } from 'vue';

export interface FocusOnCloseOptions {
  preventScroll?: boolean,
  focusVisible?: boolean,
};
/** when the show: Ref<boolean> is False, focus the item at the query selector */
export function useFocusOnClose(show: Ref<boolean>, querySelector: string, options?: FocusOnCloseOptions) {
  watch(show, (newValue, _oldValue) => {
    if (!newValue) {
      nextTick(() => {
        const el = document.querySelector(querySelector) as HTMLElement;
        if (el) {
          el.focus(options);
        }
      });
    }
  });
}