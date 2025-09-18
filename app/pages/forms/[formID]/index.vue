<template>
  <div class="container mx-auto py-10">
    <ElementSettings @element-saved="elementSaved" />
    <div class="flex items-center gap-x-4 mb-6">
      <p>Drag and drop form elements:</p>
      <ul class="flex items-center gap-x-1">
        <li
          v-for="element in dragElements"
          :key="element.type"
          draggable="true"
          @dragstart="startDrag($event, element)"
        >
          <Button>{{ element.label }}</Button>
        </li>
      </ul>
    </div>

    <p v-if="!sortedElements.length">Elements not yet</p>
    <form
      class="grid grid-cols-12 min-h-[100px] gap-2"
      @drop="onDrop($event)"
      @dragover.prevent
      @dragenter.prevent
    >
      <div
        v-for="element in sortedElements"
        :key="element.id"
        :class="{
          'col-span-1': element.width === 1,
          'col-span-2': element.width === 2,
          'col-span-3': element.width === 3,
          'col-span-4': element.width === 4,
          'col-span-5': element.width === 5,
          'col-span-6': element.width === 6,
          'col-span-7': element.width === 7,
          'col-span-8': element.width === 8,
          'col-span-9': element.width === 9,
          'col-span-10': element.width === 10,
          'col-span-11': element.width === 11,
          'col-span-12': element.width === 12,
        }"
      >
        <div class="flex items-center justify-between mb-2">
          <label
            :for="element.name"
            class="block mb-2 font-medium"
            v-if="element.label"
            >{{ element.label }}</label
          >
          <ElementSettings :element="element" @element-saved="elementSaved" />
        </div>

        <Input
          v-if="element.type === 'text'"
          type="text"
          :id="element.name"
          :name="element.name"
          :required="element.required"
          :placeholder="element.options?.placeholder || ''"
          :default-value="element.options?.defaultValue || ''"
          :model-value="element.options?.defaultValue"
          class="w-full border rounded px-3 py-2"
        />

        <Textarea
          v-else-if="element.type === 'textarea'"
          :id="element.name"
          :name="element.name"
          :required="element.required"
          class="w-full border rounded px-3 py-2"
          rows="4"
          :class="[`col-span-${element.width}`]"
          :placeholder="element.options?.placeholder || ''"
          :default-value="element.options?.defaultValue || ''"
          :model-value="element.options?.defaultValue"
        />

        <DatePicker v-else-if="element.type === 'date'" />

        <div
          v-else-if="element.type === 'checkbox'"
          class="flex flex-col gap-y-1"
        >
          <div
            v-for="checkbox in element.options?.items"
            class="flex items-center space-x-2"
          >
            <Checkbox
              :id="`${checkbox.id}-checkbox`"
              v-model="checkbox.checked"
            />
            <Label
              :for="`${checkbox.id}-checkbox`"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {{ checkbox.label }}
            </Label>
          </div>
        </div>

        <Select
          v-else-if="
            element.type === 'select' && !element.options?.isRelatedWith
          "
          :id="element.name"
          :name="element.name"
          :required="element.required"
          class="w-full border rounded px-3 py-2"
          :class="[`col-span-${element.width}`]"
          :multiple="element.options?.isMultiple"
          @update:model-value="triggerRelatedSelect"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="1">Ferghana</SelectItem>
            <SelectItem :value="2">Bukhara</SelectItem>
            <SelectItem :value="3">Samarkand</SelectItem>
          </SelectContent>
        </Select>
        <Select
          v-else-if="
            element.type === 'select' && element.options?.isRelatedWith
          "
          :id="element.name"
          :name="element.name"
          :required="element.required"
          class="w-full border rounded px-3 py-2"
          :class="[`col-span-${element.width}`]"
          :multiple="element.options?.isMultiple"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an district" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="dist in triggeredParentSelectValueData"
              :key="dist.id"
              :value="dist.id"
              >{{ dist.name }}</SelectItem
            >
          </SelectContent>
        </Select>
        <div v-else-if="element.type === 'radio'" class="space-y-2">
          <RadioGroup
            :default-value="element.options.defaultValue"
            orientation="vertical"
            :required="element.required"
          >
            <div
              v-for="radioItem in element.options.items"
              class="flex items-center space-x-2"
            >
              <RadioGroupItem :id="radioItem.id" :value="radioItem.value" />
              <Label :for="radioItem.id">{{ radioItem.label }}</Label>
            </div>
          </RadioGroup>
        </div>

        <div v-else>Unsupported element type: {{ element.type }}</div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { ElementType, FormElementType } from '~/pages/type';
import { useStorage } from '@vueuse/core';
import ElementSettings from './components/ElementSettings.vue';

const dragElements = ref([
  {
    type: 'text',
    label: 'Text',
  },
  {
    type: 'textarea',
    label: 'Textarea',
  },
  {
    type: 'select',
    label: 'Select',
  },
  {
    type: 'radio',
    label: 'Radio',
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
  },
  {
    type: 'date',
    label: 'Date',
  },
]);

const route = useRoute();
const formID = route.params.formID as string;
const triggeredParentSelectValue = ref<number[] | null>(null);

const formsList = useStorage('forms', [], undefined, {
  serializer: { read: JSON.parse, write: JSON.stringify },
});

const districts = useStorage(
  'districts',
  [
    {
      id: 1,
      regionId: 1,
      name: 'Fergana',
    },
    {
      id: 2,
      regionId: 1,
      name: 'Margilan',
    },
    {
      id: 3,
      regionId: 2,
      name: 'Bukhara',
    },
    {
      id: 4,
      regionId: 2,
      name: 'Gijduvan',
    },
    {
      id: 5,
      regionId: 3,
      name: 'Samarkand',
    },
    {
      id: 6,
      regionId: 3,
      name: 'Kattakurgan',
    },
  ],
  undefined,
  {
    serializer: { read: JSON.parse, write: JSON.stringify },
  },
);

const form = computed(() =>
  formsList.value.find((f: { id: number }) => f.id === +formID),
);

const triggeredParentSelectValueData = computed(() => {
  return districts.value.filter((d: { regionId: number }) =>
    triggeredParentSelectValue.value?.includes(d.regionId),
  );
});

const sortedElements = computed(
  () =>
    form.value?.elements?.toSorted(
      (a: ElementType, b: ElementType) => a.order - b.order,
    ) ?? [],
);

const startDrag = (evt: DragEvent, item: any) => {
  if (!evt.dataTransfer) return;
  evt.dataTransfer.effectAllowed = 'move';
  evt.dataTransfer.setData('itemType', item.type);
};

const onDrop = (evt: DragEvent) => {
  if (!evt.dataTransfer) return;

  const itemType = evt.dataTransfer.getData('itemType');

  if (!itemType) return;

  const newElement: ElementType = {
    id: Date.now(),
    name: `${itemType}_default_name`,
    order: form.value?.elements?.length || 0,
    label: `${itemType}_default_label`,
    type: itemType as FormElementType,
    required: false,
    width: 12,
    options:
      itemType === 'text' || itemType === 'textarea'
        ? { placeholder: '', defaultValue: '' }
        : itemType === 'radio'
          ? { items: [], defaultValue: '' }
          : itemType === 'checkbox'
            ? { items: [] }
            : itemType === 'select'
              ? {
                  isRelated: false,
                  isRelatedSelectRequired: false,
                  isRelatedWith: null,
                  isMultiple: false,
                  items: [],
                }
              : {},
  };

  formsList.value = formsList.value.map(
    (f: { id: number; elements: ElementType[] }) =>
      f.id === +formID
        ? { ...f, elements: [...(f.elements || []), newElement] }
        : f,
  );
};

const elementSaved = (element: ElementType) => {
  const existingElement = form.value.elements.find(
    (el: ElementType) => el.id === element.id,
  );

  if (existingElement) {
    form.value.elements = form.value.elements.map((el: ElementType) =>
      el.id === element.id ? element : el,
    );
    formsList.value = [
      ...formsList.value.filter((f: { id: number }) => f.id !== +formID),
      form.value,
    ];
    return;
  }

  form.value.elements.push(element);
  formsList.value = [
    ...formsList.value.filter((f: { id: number }) => f.id !== +formID),
    form.value,
  ];
};

const triggerRelatedSelect = (value: any) => {
  triggeredParentSelectValue.value = Array.isArray(value) ? value : [value];
};
</script>

<style scoped></style>
