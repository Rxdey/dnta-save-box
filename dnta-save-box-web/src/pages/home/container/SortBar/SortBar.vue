<template>
    <div class="sort-bar">
        <div class="tabs">
            <div class="tab-item" :class="{ active: active === i }" v-for="(tab, i) in tabs" :key="tab.label" @click="onTabChange(i, tab)">{{ tab.label }}</div>
        </div>

        <div class="order">
            <el-icon :size="18" class="order-icon" :class="{desc: sort}" @click="onSort">
                <MdiSortAscending />
            </el-icon>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MdiSortAscending } from '@/components/Icon'

const tabs = ref([
    { label: 'ALL', key: '' },
    { label: 'IMG', key: 'img' },
    { label: 'TEXT', key: 'text' },
    { label: 'URL', key: 'url' },
]);
const active = ref(0);
const sort = ref(false);
const emit = defineEmits(['typeChange', 'sort']);

const onTabChange = (i, tab) => {
    active.value = i;
    emit('typeChange', tab);
};
const onSort = () => {
    sort.value = !sort.value;
    emit('sort', sort.value);
};


</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
