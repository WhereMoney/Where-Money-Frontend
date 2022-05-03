<template>
<div>
    <icon-ion:logo-alipay/>
    <n-button v-on:click="testButton">按钮</n-button>
    {{ testToken }}
</div>
</template>

<script lang="ts" setup>
import {generateToken} from "@/apis";
import {Ref, ref} from 'vue';
import {GenerateTokenResponse} from "@/interface";
declare const window: Window & { $message: any; };
let testToken: Ref<string> = ref("");

function testButton(): void {
    generateToken({account: 1, role: "业务员"}).then((response: GenerateTokenResponse) => {
        testToken.value = response.token;
    }).catch((_error: any) => {
    });
}
</script>

<style scoped>

</style>
