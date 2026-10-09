<template>
  <button    
    :aria-label="label"
    @click="$emit('click')"
  >
    <font-awesome-icon
      class="fa-close-icon"
      icon="xmark"
      size="lg"
      :style="{ color: color }"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  label: string;
  color?: string;
}>();
import { useTheme } from 'vuetify';
const theme = useTheme();
// get the theme color if that is what was passed in
const color = computed(() => {
  if (props.color && theme.current.value.colors[props.color]) {
    return theme.current.value.colors[props.color];
  }
  return props.color;
});

defineEmits<{ click: [] }>();
</script>
<style scoped>
button {
  line-height: 1;
}

/* font-awesome close (times) button */
.fa-close-icon {
  cursor: pointer;
  aspect-ratio: 1/1;
  width: auto;
  transition: scale 0.2s ease-in-out;
}
.fa-close-icon:hover {
  scale: 1.2;
}

</style>