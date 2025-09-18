<script setup lang="ts">
interface CheckboxItem {
  id: number;
  label: string;
  value: string;
  checked: boolean;
}

const items = defineModel<CheckboxItem[]>('items', {
  default: () => [],
});

const isShowNotFilledWarningText = ref(false);
const list = computed(() => items.value);
const isAllLabelsAndValuesFilled = computed(() =>
  items.value.every((item) => !!item.label.trim() && !!item.value.trim()),
);

function removeItem(id: number) {
  items.value = items.value.filter((item) => item.id !== id);
}

function addItem() {
  if (isAllLabelsAndValuesFilled.value) {
    items.value.push({
      id: Date.now(),
      label: '',
      value: '',
      checked: false,
    });
  } else {
    isShowNotFilledWarningText.value = true;
  }
}

function setChecked(id: number) {
  const checkedItem = items.value.find((item) => item.id === id);

  checkedItem!.checked = !checkedItem?.checked;
}

watch(isAllLabelsAndValuesFilled, (val) => {
  if (val) {
    isShowNotFilledWarningText.value = false;
  }
});
</script>

<template>
  <div class="space-y-4">
    <Label>Checkbox Options</Label>

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
        :model-value="item.checked"
        @update:model-value="setChecked(item.id)"
      />
      <span class="ml-2">Checked</span>
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
      +Add checkbox option
    </Button>
  </div>
</template>
