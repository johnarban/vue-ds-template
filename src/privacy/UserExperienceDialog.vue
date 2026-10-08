<template>
  <v-expand-transition>
    <UserExperience
      v-if="showRating"
      :question="question"
      icon-size="2x"
      @dismiss="emit('dismiss')"
      @rating="(rating) => emit('rating', rating)"
      @finish="(rating, comments) => emit('finish', rating, comments)"
    >
      <template #footer>
        <div id="user-experience-footer">
          <v-btn
            class="rating-opt-put"
            color="#BDBDBD"
            size="small"
            variant="outlined"
            @click="emit('opt-out')"
          >
            Don't show again
          </v-btn>
          <v-btn
            class="privacy-button"
            color="#BDBDBD"
            size="small"
            variant="outlined"
            @click="emit('what-is-this')"
          >
            What is this?
          </v-btn>
        </div>
      </template>
    </UserExperience>
  </v-expand-transition>
</template>

<script setup lang="ts">
import { UserExperience, type UserExperienceRating } from "@cosmicds/vue-toolkit";

defineProps<{
  showRating: boolean;
  question: string;
}>();

const emit = defineEmits<{
  (event: "dismiss" | "opt-out" | "what-is-this"): void;
  (event: "rating", rating: UserExperienceRating | null): void;
  (event: "finish", rating: UserExperienceRating | null, comments: string | null): void;
}>();
</script>

<style lang="less">
/* copied from rubin-first-look (and carina, radwave-in-motion, jwst-brick, ...):
   float the toolkit's own card via its root class rather than a dialog */
#cds-user-experience.rating-root {
  position: absolute !important;
  right: 5px;
  bottom: 5px;
  // padding: 1em;
  // outline: 1px solid rgba(var(--v-theme-on-background), .5) !important;
  // width: fit-content !important;
  // background-color: rgb(var(--v-theme-background)) !important;
  // z-index: 20000;
  
  .v-card-item {
    padding: 0px;
  }

  .rating-title {
    color: #EFEFEF;
    font-size: 0.7em;
    
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    
    .v-spacer {
      display: none;
    }
    
    .v-btn.close-button {
      position: static;
      top: unset;
      right: unset;
    }
  }

  .rating-icon-row {
    padding: 0px;

    .svg-inline--fa {
      height: 30px;
      width: 30px;
    }
  }

  .comments-box {
    width: 100%;
    margin-top: 20px;
  }

  .v-card-text {
    padding-bottom: 0;
  }

  .v-card-actions {
    padding: 0;
  }

  #user-experience-footer {
    margin: auto;
    display: flex;
    flex-direction: row;
    gap: 5px;
    
    .v-btn {
      text-transform: none;
    }
    .v-btn--variant-outlined {
      border-color: rgba(var(--v-theme-on-background), .5);
    }
  }
}
</style>
