<script setup lang="ts">
interface RadioItem {
  id: number;
  label: string;
  value: string;
  default: boolean;
}

const items = defineModel<RadioItem[]>('items', {
  default: () => [],
});

const defaultValue = defineModel<string>('defaultValue', {
  default: '',
});

const isShowNotFilledWarningText = ref(false);
const list = computed(() => items.value);
const isAllLabelsAndValuesFilled = computed(() =>
  items.value.every((item) => !!item.label.trim() && !!item.value.trim()),
);

function removeItem(id: number) {
  items.value = items.value.filter((item) => item.id !== id);

  if (items.value[0]) {
    items.value[0].default = true;
    defaultValue.value = items.value[0].value;
  } else {
    defaultValue.value = '';
  }
}

function addItem() {
  if (isAllLabelsAndValuesFilled.value) {
    items.value.push({
      id: Date.now(),
      label: '',
      value: '',
      default: !items.value.length,
    });
  } else {
    isShowNotFilledWarningText.value = true;
  }
}

function setDefault(id: number) {
  let newDefaultValue = '';

  items.value.forEach((item) => {
    item.default = item.id === id;

    if (item.id === id) {
      newDefaultValue = item.value;
    }
  });

  defaultValue.value = newDefaultValue;
}

watch(
  () => items.value,
  (val) => {
    const def = val.find((item) => item.default);

    defaultValue.value = def ? def.value : '';
  },
  { deep: true },
);

watch(isAllLabelsAndValuesFilled, (val) => {
  if (val) {
    isShowNotFilledWarningText.value = false;
  }
});
</script>

<template>
  <div class="space-y-4">
    <Label>Radio Options</Label>

    <div v-for="item in list" :key="item.id" class="flex items-center gap-2">
      <Input
        v-model="item.label"
        placeholder="Label"
        class="border rounded px-2 py-1"
      />
      <Input
        v-model="item.value"
        placeholder="Value"
        class="border rounded px-2 py-1"
      />
      <Switch
        :model-value="item.default"
        @update:model-value="setDefault(item.id)"
      />
      <span class="ml-2">Default</span>
      <Button
        v-if="list.length > 1"
        type="button"
        @click="removeItem(item.id)"
        variant="destructive"
      >
        -
      </Button>
    </div>
    <p v-if="isShowNotFilledWarningText" class="text-red-500">
      Please fill in all label and value fields before adding a new option.
    </p>
    <Button
      type="button"
      @click="addItem"
      class="bg-blue-500 text-white px-3 py-1 rounded"
    >
      +Add radio option
    </Button>
  </div>
</template>
