<template>
    <div>
        <n-card id="drawer-target" class="w-full">
            <template #header>
                <div>记一笔</div>
            </template>
            <template #header-extra>
                <Icon icon="icon-park-outline:close" class="cursor-pointer h-4 w-4"
                      v-bind:class="{'text-primary':mouseOnClose}" v-on:mouseenter="mouseOnClose=true" v-on:mouseleave="mouseOnClose=false"
                      v-on:click="closeModal"/>
            </template>
            <template #default>
                <div>
                    <n-tabs type="line" :animated="true">
                        <n-tab-pane name="支出" tab="支出">
                            <Pay></Pay>
                        </n-tab-pane>
                        <n-tab-pane name="收入" tab="收入">
                            <Income></Income>
                        </n-tab-pane>
                        <n-tab-pane name="转账" tab="转账">
                            <Transfer></Transfer>
                        </n-tab-pane>
                    </n-tabs>
                </div>
            </template>
        </n-card>
    </div>
</template>

<script lang="ts" setup>
import {Income, Pay, Transfer} from './components';
import {Icon} from "@iconify/vue";
import {Ref, ref} from "vue";

const emit = defineEmits(["close"]);

function closeModal() {
    emit('close', false);
}

let mouseOnClose: Ref<boolean> = ref(false);
</script>
<style scoped>

</style>
