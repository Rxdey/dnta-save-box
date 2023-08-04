<template>
    <div class="sort-bar">
        <template v-if="!isVideo">
            <div class="sort-btn">
                <IconButton @click="isWaterfall">
                    <EpSetUp />
                </IconButton>
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
        <div class="get-cover sort-btn" v-if="isVideo">
            <IconButton @click="onGetCover" v-bind="{ loading, success, error }">
                <EpDownload />
            </IconButton>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MdiSortAscending, MdiViewDashboardVariant } from '@/components/Icon';
import IconButton from '@/components/IconButton/IconButton.vue';
import useDragStore from '@/store/modules/useDragStore';
import * as Server from '@/service/model/api';

const store = useDragStore();
const route = useRoute();

const isVideo = computed(() => route.params.key === 'video');

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
