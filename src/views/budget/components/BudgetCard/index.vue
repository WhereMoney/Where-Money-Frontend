<template>
    <n-card class="rounded-[16px] shadow-sm" :segmented="true" v-cloak>
        <template #header>
            <div class="flex-y-center justify-between">
                <span class="text-xl font-bold">{{ book.title }}</span>
                <n-button text @click="showAddModal = true; store.selectedBillCategoryId = -1;">
                    <icon icon="fluent:add-24-filled" height="24px" />
                    <span class="text-base ml-2">新增预算</span>
                </n-button>
            </div>
        </template>

        <template #default>
            <n-empty v-if="budgetList && budgetList.length === 0">
                <span class="text-lg">暂无预算</span>
            </n-empty>

            <template v-else-if="budgetList != undefined">
                <n-card :bordered="false" size="small" :segmented="true">
                    <!-- 账本总预算 -->
                    <template #header>
                        <div class="book-budget-info flex-y-center justify-between">
                            <!-- 左侧 -->
                            <div class="flex flex-col">
                                <span class="text-lg font-bold">总预算</span>
                                <span class="text-xs">总额: {{ book.totalBudget }}</span>
                            </div>
                            <!-- 右侧[进度条、修改]切换 -->
                            <div class="flex-y-center justify-end">
                                <div v-if="bookBudgetEdit" class="flex flex-col">
                                    <n-input-group>
                                        <n-input-group-label size="small">总额</n-input-group-label>
                                        <n-input-number size="small" :style="{ width: '100px', textAlign: 'center' }"
                                            :show-button="false" v-model:value="bookTotalBudget"
                                            :min="bookBudgetTotalMin">
                                            <template #prefix>￥</template>
                                        </n-input-number>
                                        <n-button text @click="submitBookBudgetChange">
                                            <icon class="text-blue-600" icon="bi:check" height="32"></icon>
                                        </n-button>
                                    </n-input-group>
                                    <n-input-group>
                                        <n-input-group-label size="small">已用</n-input-group-label>
                                        <n-input-number size="small" :style="{ width: '100px', textAlign: 'center' }"
                                            :show-button="false" v-model:value="bookUsedBudget"
                                            :min="bookBudgetUsedMin">
                                            <template #prefix>￥</template>
                                        </n-input-number>
                                        <n-button text @click="cancelBookBudgetInput">
                                            <icon class="text-red-600" icon="bi:x" height="32"></icon>
                                        </n-button>
                                    </n-input-group>
                                </div>

                                <div v-else class="flex-y-center">
                                    <n-button text @click="showBookBudgetInput">
                                        <div class="mr-2 h-40px flex items-end">
                                            <icon icon="carbon:edit" height="24" horizontalAlign="bottom"></icon>
                                        </div>
                                    </n-button>
                                    <n-progress type="circle"
                                        :status="book.usedBudget > book.totalBudget ? 'error' : 'success'"
                                        :percentage="book.usedBudget > book.totalBudget ? 100 : (1 - book.usedBudget / book.totalBudget) * 100"
                                        :gap-offset-degree="180">
                                        <div class="text-center">
                                            <p class="text-xs">可用</p>
                                            <p class="text-xs">
                                                {{ book.totalBudget - book.usedBudget }}
                                            </p>
                                        </div>
                                    </n-progress>
                                </div>
                            </div>
                        </div>
                    </template>
                    <!-- 分类预算 -->
                    <template #default>
                        <n-list>
                            <n-list-item v-for="budget in budgetList" :key="budget.id"
                                @click="showBudgetInfoModal(budget)">
                                <div class="budget-info flex-y-center justify-between">
                                    <!-- 左侧 icon和名字、额度信息 -->
                                    <div class="flex-y-center">
                                        <!-- icon分svg、名字字符串对应处理 -->
                                        <div class="budget-svg-container text-primary hover:text-primary-hover mr-3">
                                            <div v-if="mapBudgetToCategory.get(budget.id)?.svg.indexOf('<') !== -1"
                                                v-html="mapBudgetToCategory.get(budget.id)?.svg
                                                .replace(/(height=\u0022\d+\u0022)|(width=\u0022\d+\u0022)/, '')
                                                .replace(/>/, `width=\u0022${iconWidth}\u0022 height=\u0022${iconWidth}\u0022>`)" />
                                            <icon v-else :icon="mapBudgetToCategory.get(budget.id)?.svg"
                                                :height="iconWidth" :width="iconWidth" />
                                        </div>

                                        <div class="flex flex-col">
                                            <span class="text-base">
                                                {{ mapBudgetToCategory.get(budget.id)?.billCategoryName }}
                                            </span>
                                            <span class="text-xs">
                                                总额: {{ budget.limit }} | {{ budget.times }} 笔支出
                                            </span>
                                        </div>
                                    </div>
                                    <!-- 右侧进度条 -->
                                    <n-progress type="circle" :status="budget.used > budget.limit ? 'error' : 'success'"
                                        :percentage="budget.used > budget.limit ? 100 : (1 - budget.used / budget.limit) * 100"
                                        :gap-offset-degree="180">
                                        <div class="text-center">
                                            <p class="text-xs">
                                                {{ budget.limit - budget.used }}
                                            </p>
                                        </div>
                                    </n-progress>
                                </div>
                            </n-list-item>
                        </n-list>
                    </template>
                </n-card>
            </template>

            <add-budget-modal v-model:show-modal="showAddModal" v-model:book="book" :disabled-categories="categoryInUse"
                @manual-update-book="emit('manualUpdateBook')" />

            <budget-info-modal v-model:show-modal="showInfoModal" v-model:budget="budgetTemp"
                :category="categoryTemp" @manual-update-book="emit('manualUpdateBook')" />
        </template>
    </n-card>
</template>

<script setup lang="ts">

import { computed, defineProps, defineEmits, onMounted, PropType, ref, watch } from 'vue';
import { useMessage } from 'naive-ui';
import { Book, Budget, BillCategory, BudgetGetBudgetByBookResponse, BookAllBillCategoryResponse } from '@/interface';
import { getBudgetsByBook, getAllBillCategoryApi, setBookBudget } from '@/apis';
import { useStore } from '@/stores/store';

import { Icon } from '@iconify/vue';
import { AddBudgetModal, BudgetInfoModal } from './components';

const props = defineProps({
    book: {
        type: Object as PropType<Book>,
        required: true,
    },
});

const store = useStore();

const iconWidth = ref(24);
const budgetList = ref<Budget[]>();
const billCategoryList = ref([] as BillCategory[]);
const mapBudgetToCategory = ref(new Map<Number, BillCategory>());
const categoryInUse = ref(new Set<Number>());

function getBudgetList(id: number) {
    getBudgetsByBook({ bookId: id }).then((res: BudgetGetBudgetByBookResponse) => {
        budgetList.value = res.budgetList;
        getAllBillCategoryApi({ bookId: id, type: '支出' }).then((res: BookAllBillCategoryResponse) => {
            billCategoryList.value = res.billCategoryList;
            budgetList.value?.forEach((budget) => {
                const billCategory = billCategoryList.value.find((billCategory) => billCategory.id === budget.billCategoryId);
                mapBudgetToCategory.value.set(budget.id, billCategory!);
                categoryInUse.value.add(budget.billCategoryId);
            });
        }).catch((err: Error) => {
            console.log(err);
        });
    }).catch((err: Error) => {
        console.log(err);
    });
}

onMounted(() => {
    getBudgetList(props.book.id);
});

watch(() => props.book,
    (newBook) => getBudgetList(newBook.id),
    { deep: true, immediate: true }
);

const bookTotalBudget = ref(0);
const bookUsedBudget = ref(0);
const bookBudgetTotalMin = computed(() => budgetList.value?.reduce((acc, cur) => acc + cur.limit, 0));
const bookBudgetUsedMin = computed(() => budgetList.value?.reduce((acc, cur) => acc + cur.used, 0));
const bookBudgetEdit = ref(false);

function showBookBudgetInput() {
    bookTotalBudget.value = props.book.totalBudget;
    bookUsedBudget.value = props.book.usedBudget;
    bookBudgetEdit.value = true;
}
function cancelBookBudgetInput() {
    bookBudgetEdit.value = false;
}
const message = useMessage();
function submitBookBudgetChange() {
    const params = {
        bookId: props.book.id,
        totalBudget: bookTotalBudget.value,
        usedBudget: bookUsedBudget.value,
    };
    setBookBudget(params).then(() => {
        bookBudgetEdit.value = false;
        emit('manualUpdateBook');
        getBudgetList(props.book.id);
        message.success('修改成功！');
    }).catch((err: Error) => {
        console.log(err);
    });
}

const showAddModal = ref(false);
const emit = defineEmits(['manualUpdateBook'])

const showInfoModal = ref(false);
const budgetTemp = ref<Budget>({
    id: 0,
    bookId: 0,
    billCategoryId: 0,
    used: 0,
    limit: 0,
    times: 0,
});

const categoryTemp = ref<BillCategory>({
    id: 0,
    bookId: 0,
    billCategoryName: '',
    svg: '',
    type: '支出',
});

function showBudgetInfoModal(budget: Budget) {
    budgetTemp.value = budget;
    categoryTemp.value = mapBudgetToCategory.value.get(budget.id)!;
    showInfoModal.value = true;
}

</script>

<style lang="scss" scoped>
$--small-progress-size: 48px;
$--medium-progress-size: 64px;

.book-budget-info {
    :deep(.n-progress) {
        width: $--medium-progress-size;
        height: $--medium-progress-size;
    }
}

.budget-info {
    :deep(.n-progress) {
        width: $--small-progress-size;
        height: $--small-progress-size;
    }
}

.budget-svg-container {
    $--icon-width: 24px;
    width: $--icon-width;
    height: $--icon-width;

    svg {
        height: 100%;
    }
}

:deep(.n-card__content) {
    .n-card-header {
        padding-top: 0;
    }

    .n-list {
        margin: 0;
    }

    .n-divider {
        margin-top: 0;
    }
}

/* :deep(.n-list-item) {
    padding: 0 0 8px 0;
} */
</style>
