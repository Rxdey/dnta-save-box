<template>
    <div class="sort-bar">
        <template v-if="tagActive !== -3">
            <div class="tabs">
                <div class="tab-item" :class="{ active: active === i }" v-for="(tab, i) in tabs" :key="tab.label" @click="onTabChange(i, tab)">{{ tab.label }}</div>
            </div>


            <div class="sort-btn">
                <IconButton @click="uploadSort" v-bind="{ loading, success, error }">
                    <EpMagicStick />
                </IconButton>
            </div>


            <div class="sort-btn">
                <el-icon :size="18" class="order-icon" :class="{ desc: sort }" @click="onSort">
                    <MdiSortAscending />
                </el-icon>
            </div>
        </template>
        <div class="get-cover sort-btn" v-if="tagActive === -3">
            <IconButton @click="onGetCover" v-bind="{ loading, success, error }">
                <EpDownload />
            </IconButton>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MdiSortAscending } from '@/components/Icon';
import IconButton from '@/components/IconButton/IconButton.vue';
import useDragStore from '@/store/modules/useDragStore';
import * as Server from '@/service/model/api';

const store = useDragStore();

const tagActive = computed(() => store.active);
const tabs = ref([
    { label: 'ALL', key: '' },
    { label: 'IMG', key: 'img' },
    { label: 'TEXT', key: 'text' },
    { label: 'URL', key: 'url' },
]);
const active = ref(0);
const sort = ref(false);
const emit = defineEmits(['typeChange', 'sort']);
const loading = ref(false);
const success = ref(false);
const error = ref(false);

const onTabChange = (i, tab) => {
    active.value = i;
    emit('typeChange', tab);
};
const onSort = () => {
    sort.value = !sort.value;
    emit('sort', sort.value);
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

<style lang="less" scoped>
@import url('./index.less');
</style>
