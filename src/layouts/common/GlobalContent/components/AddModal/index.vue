<template>
    <div>
        <n-card id="drawer-target" class="w-180">
            <template #header>
                <div>记一笔</div>
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
import {Income, Pay, Transfer} from './components';</script>

<style scoped>

</style>
