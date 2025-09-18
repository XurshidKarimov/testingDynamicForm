<script setup lang="ts">
import type { ElementType } from '~/pages/type';
import { useStorage } from '@vueuse/core';
const route = useRoute();
const routeFormID = route.params.formID as string;

const isRelated = defineModel<boolean>('isRelated', {
  default: false,
});

const isMultiple = defineModel<boolean>('isMultiple', {
  default: false,
});

const isRelatedSelectRequired = defineModel<boolean>(
  'isRelatedSelectRequired',
  {
    default: false,
  },
);

const isRelatedWith = defineModel<number | null>('isRelatedWith', {
  default: null,
});

const formsList = useStorage('forms', [], undefined, {
  serializer: { read: JSON.parse, write: JSON.stringify },
});

const otherSelectTypeElements = computed(() => {
  return formsList.value
    .find((f: ElementType) => f.id === +routeFormID)
    .elements.filter((el: any) => el.type === 'select');
});

watch(isRelated, (val) => {
  isRelatedSelectRequired.value = val;
});
</script>

<template>
  <div class="space-y-4">
    <Label>Select Options</Label>
    <div class="flex items-center space-x-2">
      <Switch id="isRelatedSwitch" v-model="isRelated" />
      <Label for="isRelatedSwitch">Is related select</Label>
    </div>
    <div class="flex items-center space-x-2">
      <Switch id="isMultipleSwitch" v-model="isMultiple" />
      <Label for="isMultipleSwitch">Is multiple select</Label>
    </div>
    <Select
      v-if="isRelated"
      v-model="isRelatedWith"
      :required="isRelatedSelectRequired"
      class="w-full border rounded px-3 py-2"
      id="relatedSelect"
      name="relatedSelect"
    >
      <SelectTrigger>
        <SelectValue placeholder="Select an select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="select in otherSelectTypeElements"
          :key="select.id"
          :value="select.id"
          >{{ select.label }}</SelectItem
        >
      </SelectContent>
    </Select>
  </div>
</template>
