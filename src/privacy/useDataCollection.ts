import { ref, watch, type Ref } from "vue";

/** add a counter tracker */
export function useCounter(initial = 0) {
  const count = ref(initial);

  function increment(by = 1) {
    count.value += by;
  }

  function reset() {
    count.value = initial;
  }

  return { count, increment, reset };
}

/**
 * Total time `isActive` has been true, including the current open stretch - `current()` is a function,
 * not a computed, since the live top-up depends on Date.now() at read time, not a reactive dependency
 */
export function useElapsedTime(isActive: Ref<boolean>) {
  const accumulatedMs = ref(0);
  let startTimestamp: number | null = isActive.value ? Date.now() : null;

  watch(isActive, (active) => {
    const now = Date.now();
    if (active) {
      startTimestamp = now;
    } else if (startTimestamp !== null) {
      accumulatedMs.value += now - startTimestamp;
      startTimestamp = null;
    }
  });

  function current() {
    let total = accumulatedMs.value;
    if (startTimestamp !== null) {
      total += Date.now() - startTimestamp;
    }
    return total;
  }

  function reset() {
    accumulatedMs.value = 0;
    startTimestamp = isActive.value ? Date.now() : null;
  }

  return { current, reset };
}
