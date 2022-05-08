<template>
    <div>
        <div class="space-y-10">
            <div class="space-y-2">
                <div>
                    <n-button class="w-full h-15" v-on:click="outDrawerShower">
                        <template #default>
                            <div class="flex space-x-2">
                                <div v-if="outAssetName!=='转出账户'">
                                    <icon-ri:alipay-fill class="text-primary w-8 h-8"/>
                                </div>
                                <div class="m-auto">
                                    {{ outAssetName }}
                                </div>
                                <div class="m-auto" v-if="outAssetName!=='转出账户'">
                                    ￥{{ outAssetBalance }}
                                </div>
                            </div>
                        </template>
                    </n-button>
                </div>
                <div>
                    <div class="text-center">
                        <icon-ic:baseline-arrow-downward class="text-primary w-7 h-7"/>
                    </div>
                </div>
                <div>
                    <n-button class="w-full h-15" v-on:click="inDrawerShower">
                        <template #default>
                            <div class="flex space-x-2">
                                <div v-if="outAssetName!=='转出账户'">
                                    <icon-ri:alipay-fill class="text-primary w-8 h-8"/>
                                </div>
                                <div class="m-auto">
                                    {{ inAssetName }}
                                </div>
                                <div class="m-auto" v-if="inAssetName!=='转入账户'">
                                    ￥{{ inAssetBalance }}
                                </div>
                            </div>
                        </template>
                    </n-button>
                </div>
            </div>
            <div class="space-y-2">
                <div class="flex space-x-2">
                    <div class="w-2/3">
                        <n-input v-model:value="remark" type="text" placeholder="点此输入备注"/>
                    </div>
                    <div class="w-1/3">
                        <n-input-number v-model:value="amount" step="0.01">
                            <template #prefix>
                                ￥
                            </template>
                        </n-input-number>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <div class="w-1/4">
                        <n-button v-on:click="bookDrawerShower" class="w-full truncate">
                            <template #default>
                                <div class="text-left">
                                    {{ bookName }}
                                </div>
                            </template>
                        </n-button>
                    </div>
                    <div class="w-1/4">
                        <n-date-picker v-model:value="timestamp" type="date" clearable="true"/>
                    </div>
                    <div class="w-1/4">
                        <n-time-picker v-model:value="timestamp"/>
                    </div>
                    <div class="w-1/4">
                        <n-popover trigger="hover">
                            <template #trigger>
                                <n-button class="w-full" v-bind:type="fee === 0 ? '' : 'primary'"
                                          v-on:click="feeDrawerShower">
                                    <template #default>
                                        手续费
                                    </template>
                                </n-button>
                            </template>
                            <template #default>
                                ￥{{ fee }}
                            </template>
                        </n-popover>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <n-upload :custom-request="customRequest" list-type="image-card" max="1" class="w-1/5">
                        <template #default>
                            <div>
                                图片
                            </div>
                        </template>
                    </n-upload>
                    <div class="my-auto">
                        {{ fileName }}
                    </div>
                </div>
            </div>
            <div>
                <n-button class="w-full addButton" type="primary" v-on:click="addBill">
                    <template #default>
                        保存
                    </template>
                </n-button>
            </div>
        </div>
        <n-drawer v-model:show="showOutDrawer" :height="300" :placement="'bottom'" to="#drawer-target">
            <n-drawer-content>
                <template #header>
                    <div>
                        选择转出账户
                    </div>
                </template>
                <template #default>
                    <div>
                        <n-radio-group v-model:value="outSelector" class="space-y-4 ">
                            <div v-for="item in assetList">
                                <n-radio v-bind:key="item.id" v-bind:value="item.assetName">
                                    <div class="flex space-x-2 align-middle">
                                        <div>
                                            <icon-ri:alipay-fill class="text-primary w-8 h-8"/>
                                        </div>
                                        <div class="w-100 m-auto">
                                            {{ item.assetName }}
                                        </div>
                                        <div class="m-auto">
                                            ￥{{ item.balance }}
                                        </div>
                                    </div>
                                </n-radio>
                            </div>
                        </n-radio-group>
                    </div>
                </template>
            </n-drawer-content>
        </n-drawer>
        <n-drawer v-model:show="showInDrawer" :height="300" :placement="'bottom'" to="#drawer-target">
            <n-drawer-content>
                <template #header>
                    <div>
                        选择转入账户
                    </div>
                </template>
                <template #default>
                    <div>
                        <n-radio-group v-model:value="inSelector" class="space-y-4 ">
                            <div v-for="item in assetList">
                                <n-radio v-bind:key="item.id" v-bind:value="item.assetName">
                                    <div class="flex space-x-2">
                                        <div>
                                            <icon-ri:alipay-fill class="text-primary w-8 h-8"/>
                                        </div>
                                        <div class="w-100 m-auto">
                                            {{ item.assetName }}
                                        </div>
                                        <div class="m-auto">
                                            ￥{{ item.balance }}
                                        </div>
                                    </div>
                                </n-radio>
                            </div>
                        </n-radio-group>
                    </div>
                </template>
            </n-drawer-content>
        </n-drawer>
        <n-drawer v-model:show="showBookDrawer" :height="200" :placement="'bottom'" to="#drawer-target">
            <n-drawer-content>
                <template #header>
                    <div>
                        选择账本
                    </div>
                </template>
                <template #default>
                    <n-radio-group v-model:value="bookSelector" class="space-y-4 ">
                        <div v-for="item in bookList">
                            <n-radio v-bind:key="item.id" v-bind:value="item.title">
                                <div class="flex space-x-2 item-center">
                                    <div class="w-128 m-auto">
                                        {{ item.title }}
                                    </div>
                                    <div>
                                        <n-tag class="bg-primary-active cursor-pointer">
                                            每月{{ item.beginDate }}日起始
                                        </n-tag>
                                    </div>
                                </div>
                            </n-radio>
                        </div>
                    </n-radio-group>
                </template>
            </n-drawer-content>
        </n-drawer>
        <n-drawer v-model:show="showFeeDrawer" :height="150" :placement="'bottom'" to="#drawer-target">
            <n-drawer-content>
                <template #header>
                    <div>
                        输入手续费
                    </div>
                </template>
                <template #default>
                    <div>
                        <n-input-number v-model:value="fee" step="0.01">
                            <template #prefix>
                                ￥
                            </template>
                        </n-input-number>
                    </div>
                </template>
            </n-drawer-content>
        </n-drawer>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref, Ref, watch} from "vue";
import {addBillApi, getAllAsset, getAllBookApi, getBookApi} from "@/apis";
import {Asset, AssetGetAllAssetResponse, Book, BookGetAllBookResponse, BookGetBookResponse} from "@/interface";
import {UploadCustomRequestOptions} from "naive-ui";

let remark: Ref<string> = ref("");
let amount: Ref<number> = ref(0);
let bookName: Ref<string> = ref("");
let bookId: Ref<number> = ref(0);
let timestamp: Ref<number> = ref(0);
let outAssetName: Ref<string> = ref("");
let inAssetName: Ref<string> = ref("");
let outAssetBalance: Ref<number> = ref(0);
let inAssetBalance: Ref<number> = ref(0);
onMounted(() => {
    bookId.value = 23;
    timestamp.value = Date.now();
    outAssetName.value = "转出账户";
    inAssetName.value = "转入账户";
    getBookApi({id: bookId.value}).then((response: BookGetBookResponse) => {
        bookName.value = response.book.title;
    }).catch(() => {
    });
});
let assetList: Ref<Array<Asset>> = ref([]);
let showOutDrawer: Ref<boolean> = ref(false);
let outAssetId: Ref<number> = ref(0);

function outDrawerShower() {
    showOutDrawer.value = true;
    getAllAsset().then((response: AssetGetAllAssetResponse) => {
        assetList.value = response.assetList;
    });
}

let outSelector: Ref<string> = ref("");
watch(outSelector, (value: string) => {
    if (value) {
        let asset: Asset | undefined = assetList.value.find(item => item.assetName === value);
        if (asset) {
            outAssetId.value = asset.id;
            outAssetName.value = asset.assetName;
            outAssetBalance.value = asset.balance;
        }
    }
});
let showInDrawer: Ref<boolean> = ref(false);
let inAssetId: Ref<number> = ref(0);

function inDrawerShower() {
    showInDrawer.value = true;
    getAllAsset().then((response: AssetGetAllAssetResponse) => {
        assetList.value = response.assetList;
    });
}

let inSelector: Ref<string> = ref("");
watch(inSelector, (value: string) => {
    if (value) {
        let asset: Asset | undefined = assetList.value.find(item => item.assetName === value);
        if (asset) {
            inAssetId.value = asset.id;
            inAssetName.value = asset.assetName;
            inAssetBalance.value = asset.balance;
        }
    }
});
let bookList: Ref<Array<Book>> = ref([]);
let showBookDrawer: Ref<boolean> = ref(false);
let bookSelector: Ref<string> = ref("");

function bookDrawerShower() {
    showBookDrawer.value = true;
    getAllBookApi().then((response: BookGetAllBookResponse) => {
        bookList.value = response.bookList;
        let bookTitle: string | undefined = bookList.value.find(item => item.id === bookId.value)?.title;
        if (bookTitle) {
            bookSelector.value = bookTitle;
        }
    }).catch(() => {
    });
}

watch(bookSelector, (value: string) => {
    if (value) {
        let book: Book | undefined = bookList.value.find(item => item.title === value);
        if (book) {
            bookId.value = book.id;
            bookName.value = book.title;
        }
    }
});

let showFeeDrawer: Ref<boolean> = ref(false);
let fee: Ref<number> = ref(0);

function feeDrawerShower() {
    showFeeDrawer.value = true;
}

let picture: FormData = new FormData();
let fileName: Ref<string> = ref("");
const customRequest = ({file}: UploadCustomRequestOptions) => {
    picture.append('file', file.file as File);
    fileName.value = file.name;
    console.log(file);
};

declare const window: Window & { $message: any; };

function addBill(): void {
    if (outAssetId.value === 0) {
        window.$message.error("请选择转出账户");
        return;
    }
    if (inAssetId.value === 0) {
        window.$message.error("请选择转入账户");
        return;
    }
    console.log(picture.get("file"));
    let test: FormData = new FormData();
    test.append("bookId", bookId.value as any);
    test.append("outAssetId", outAssetId.value as any);
    test.append("inAssetId", inAssetId.value as any);
    test.append("billCategoryId", 1 as any);
    test.append("type","转账");
    test.append("amount", amount.value as any);
    test.append("time", '2022-04-01 00:00:00' as any);
    test.append("remark", remark.value as any);
    test.append("file", picture.get("file") as any);
    addBillApi(test).then(() => {

    });
}
</script>

<style scoped>
</style>
