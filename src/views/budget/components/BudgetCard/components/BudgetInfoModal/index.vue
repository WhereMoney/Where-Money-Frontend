<template>
    <n-modal :auto-focus="false" preset="card" display-directive="show" class="w-400px" :show="showModal"
        @close="closeModal" @after-enter="resetValue">
        <template #header>
            <n-space align="flex-end" justify="start">
                <span class="text-lg font-bold">预算详情</span>
                <n-button text size="small" @click="canInput = true">
                    <div v-show="!canInput" class="flex-y-center">
                        <span class="text-sm">修改</span>
                        <icon icon="fluent:edit-48-regular" height="1rem" width="1rem"></icon>
                    </div>
                </n-button>
            </n-space>

        </template>

        <template #default>
            <n-form :model="budgetInfoVar" label-width="80" :inline="false">
                <n-space vertical :size="16">
                    <form-item-container label="类别">
                        <n-input class="w-200px" size="medium" :disabled="true"
                            v-model:value="category.billCategoryName" />
                        <Icon class="text-primary mx-2" :icon="category.svg" height="24"></Icon>
                    </form-item-container>

                    <form-item-container label="总额">
                        <n-input-number class="w-200px" size="medium" :show-button="false" :disabled="!canInput"
                            :min="0" v-model:value="budgetInfoVar.limit">
                            <template #prefix>￥</template>
                        </n-input-number>
                    </form-item-container>

                    <form-item-container label="已使用">
                        <n-input-number class="w-200px" size="medium" :show-button="false" :disabled="!canInput"
                            :min="0" v-model:value="budgetInfoVar.used">
                            <template #prefix>￥</template>
                        </n-input-number>
                    </form-item-container>

                    <form-item-container label="消费次数">
                        <n-input-number class="w-200px" size="medium" :show-button="true" :disabled="!canInput" :min="0"
                            v-model:value="budgetInfoVar.times"
                            :validator="(value) => value.toString().indexOf('.') === -1">
                            <template #prefix></template>
                        </n-input-number>
                    </form-item-container>


                    <n-button class="w-full" :disabled="!canInput" type="primary" @click="applyChanges">
                        <span>保存</span>
                    </n-button>
                </n-space>
            </n-form>

        </template>
    </n-modal>
</template>

<script setup lang="ts">

import { defineProps, defineEmits, ref, PropType } from 'vue';
import { BillCategory, Budget } from '@/interface';
import { updateBudget } from '@/apis';

import { Icon } from '@iconify/vue';
import { FormItemContainer } from './components';

const props = defineProps({
    showModal: {
        type: Boolean,
        required: true,
    },
    budget: {
        type: Object as PropType<Budget>,
        required: true
    },
    category: {
        type: Object as PropType<BillCategory>,
        required: true
    }
});

const canInput = ref(false);
const budgetInfoVar = ref<Budget>({ ...props.budget });

const budgetBackup = ref<Budget>({
    id: 0,
    bookId: 0,
    billCategoryId: 0,
    used: 0,
    limit: 0,
    times: 0,
});

const emit = defineEmits(['update:showModal', 'manualUpdateBook', 'update:budget']);
function closeModal() {
    emit('update:showModal', false);
    canInput.value = false;
    budgetInfoVar.value = budgetBackup.value;
}

function resetValue() {
    budgetBackup.value = Object.assign({}, props.budget);
    budgetInfoVar.value = budgetBackup.value;
}

function applyChanges() {
    const param = {
        budgetId: budgetInfoVar.value.id,
        billCategoryId: budgetInfoVar.value.billCategoryId,
        limit: budgetInfoVar.value.limit,
        amount: budgetInfoVar.value.used,
        times: budgetInfoVar.value.times
    };
    updateBudget(param).then(() => {
        emit('update:budget', budgetInfoVar.value);
        emit('manualUpdateBook');
        closeModal();
    }).catch((err: Error) => {
        console.error(err);
    });
}

</script>

<style lang="scss" scoped>
:deep(.option-container) {
    width: 200px;
}
</style>
