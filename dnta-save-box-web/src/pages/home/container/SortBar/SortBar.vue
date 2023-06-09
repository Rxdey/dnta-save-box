<template>
    <div class="sort-bar">
        <div class="tabs">
            <div class="tab-item" v-for="tab in tabs" :key="tab.label">{{ tab.label }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const tabs = ref([
    { label: 'ALL', key: '' },
    { label: 'IMG', key: 'img' },
    { label: 'TEXT', key: 'text' },
    { label: 'URL', key: 'url' },
]);
const active = ref(0);

</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
