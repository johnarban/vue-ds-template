<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div class="element-test-page">
    <div>
      <select id="test" name="test">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </select>
    </div>
    
    <div>
      <label for="input">
        Test Label
      </label>
      <input id="input" type="text" />
    </div>
    <div>
      <label for="input-2">
        Test Label 2
      </label>
      <input id="input-2" type="checkbox" />
    </div>
    <div>
      <label for="input-3">
        Test Label
      </label>
      <input id="input-3" type="radio" />
    </div>
    <div>
      <label for="input">
        Test Label
      </label>
      <input id="input" type="text" />
    </div>
    <div>
      <button>Button</button>
    </div>
    <div>
      <v-checkbox label="Checkbox"></v-checkbox>
    </div>
    <div>
      <v-slider 
        min="1" 
        max="100" 
        step="1" 
        label="Slider"
        @update:focused="onSliderFocusChange"
        @blur="onSliderBlur"
      />
    </div>
    <div>
      <v-switch label="switch"></v-switch>
    </div>
    <div>
      <v-text-field></v-text-field>
    </div>
    <div>
      <v-select :items="['Item 1', 'Item 2', 'Item 3']"></v-select>
    </div>
    <div>
      <v-btn> hello </v-btn>
    </div>
    <div>
      <label for="input-4">
        No type
      </label>
      <input id="input-4" />
    </div>
    <div>
      <label for="textarea">
        Textarea
      </label>
      <textarea id="textarea"></textarea>
    </div>
    <div>
      <v-textarea label="v-textarea"></v-textarea>
    </div>
    <div>
      <v-autocomplete label="v-autocomplete" :items="['Item 1', 'Item 2', 'Item 3']"></v-autocomplete>
    </div>
    <div>
      <v-combobox label="v-combobox" :items="['Item 1', 'Item 2', 'Item 3']"></v-combobox>
    </div>
    <div>
      <v-file-input label="v-file-input"></v-file-input>
    </div>
    <div>
      <v-number-input label="v-number-input"></v-number-input>
    </div>
    <div>
      <v-otp-input length="4"></v-otp-input>
    </div>
    <div>
      <v-radio-group label="v-radio-group">
        <v-radio label="Radio 1" value="1"></v-radio>
        <v-radio label="Radio 2" value="2"></v-radio>
      </v-radio-group>
    </div>
    <div>
      <v-range-slider label="Range" :model-value="[20, 60]"></v-range-slider>
    </div>
    <div>
      <v-rating></v-rating>
    </div>
    <div>
      <v-btn-toggle>
        <v-btn>One</v-btn>
        <v-btn>Two</v-btn>
      </v-btn-toggle>
    </div>
    <div>
      <v-chip link>v-chip link</v-chip>
    </div>
    <div>
      <v-tabs>
        <v-tab>Tab 1</v-tab>
        <v-tab>Tab 2</v-tab>
      </v-tabs>
    </div>
    <div>
      <v-expansion-panels>
        <v-expansion-panel title="Panel" text="Panel text"></v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div>
      <v-list>
        <v-list-item link title="List item 1"></v-list-item>
        <v-list-item link title="List item 2"></v-list-item>
      </v-list>
    </div>
    <div>
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props">v-menu</v-btn>
        </template>
        <v-list>
          <v-list-item link title="Menu item 1"></v-list-item>
          <v-list-item link title="Menu item 2"></v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>
<script setup lang="ts">
function onSliderFocusChange(focused: boolean) {
  console.log('Slider focus changed:', focused);
}
function onSliderBlur() {
  console.log('Slider lost focus');
}

</script>
<style lang="less">
.element-test-page {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  background-color: rgb(var(--v-theme-surface));
  padding: 1rem;
  pointer-events: auto;
  
  > div {
    flex-grow: 0;
    flex-basis: 20%;
    flex-shrink: 1;
  }

  >div>select, >div>input, >div>button {
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 4px;
  }
  
  >button:active {
    background-color: rgba(255, 255, 255, 0.2);
  }

}
</style>