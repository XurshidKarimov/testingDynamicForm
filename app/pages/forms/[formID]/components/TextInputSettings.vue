<template>
  <div class="flex flex-col gap-4">
    <Label for="placeholderModel">Placeholder text</Label>
    <Input v-model="placeholderModel" id="placeholderModel" />
    <Label for="defaultValue">Default value</Label>
    <Input v-model="defaultValue" />
  </div>
</template>

<script setup lang="ts">
const placeholderModel = defineModel('placeholder', {
  default: '',
});

const defaultValue = defineModel('defaultValue', {
  default: '',
});
</script>

<style scoped></style>
