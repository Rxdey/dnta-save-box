<template>
    <div class="sort-bar">
        <template v-if="!isVideo">
            <div class="tabs">
                <div class="tab-item" :class="{ active: active === i }" v-for="(tab, i) in tabs" :key="tab.label" @click="onTabChange(i, tab)">{{ tab.label }}</div>
            </div>
            <div class="sort-btn" title="瀑布流">
                <IconButton @click="isWaterfall">
                    <EpSetUp />
                </IconButton>
            </div>
            <div class="sort-btn"  title="重置索引">
                <IconButton @click="uploadSort" v-bind="{ loading, success, error }">
                    <EpMagicStick />
                </IconButton>
            </div>
            <div class="sort-btn" title="反向">
                <el-icon :size="18" class="order-icon" :class="{ desc: sort }" @click="onSort">
                    <v-icon icon="humbleicons:exchange-horizontal" />
                </el-icon>
            </div>
        </template>
        <div class="get-cover sort-btn" v-if="isVideo" title="转换">
            <IconButton @click="onGetCover" v-bind="{ loading, success, error }">
                <EpDownload />
            </IconButton>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import IconButton from '@/components/IconButton/IconButton.vue';
import useMainStore from '@/store/modules/useMainStore';
import * as Server from '@/service/model/api';

const store = useMainStore();
const route = useRoute();
const tabs = [
    { label: 'ALL', key: '' },
    { label: 'IMG', key: 'img' },
    { label: 'TEXT', key: 'text' },
    { label: 'URL', key: 'url' },
];
const isVideo = computed(() => route.params.tid === 'video');

const active = ref(0);
const sort = ref(false);
const emit = defineEmits(['typeChange', 'sort']);
const loading = ref(false);
const success = ref(false);
const error = ref(false);

const isWaterfall = () => {
    store.UPDATE_WATERFALL(!store.waterfall);
};
const onSort = () => {
    sort.value = !sort.value;
    emit('sort', sort.value);
};
const onTabChange = (i, tab) => {
    active.value = i;
    emit('typeChange', tab);
};
const onGetCover = async () => {
    if (loading.value || success.value || error.value) return;
    loading.value = true;
    const res = await Server.VideoGetCoverUseGet();
    loading.value = false;
    success.value = res.success;
    error.value = !res.success;
    setTimeout(() => {
        success.value = false;
        error.value = false;
    }, 1000);
};

const uploadSort = async () => {
    if (loading.value || success.value || error.value) return;
    loading.value = true;
    const res = await Server.FavoriteUpdateSortUsePOST();
    loading.value = false;
    success.value = res.success;
    error.value = !res.success;
    setTimeout(() => {
        success.value = false;
        error.value = false;
    }, 1000);
}

</script>

<style lang="less">
@import url('./index.less');
</style>
