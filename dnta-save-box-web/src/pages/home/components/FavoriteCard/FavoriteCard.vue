<template>
    <div class="favorite-card" :class="{ drag: drag }" draggable="true" @dragstart="dragstart" @dragend="dragend">
        <div class="drag-title ov-1">{{ props.data.title }}</div>
        <div class="favorite-card--preview" @click="onPreviewClick">
            <!-- <img v-if="props.data.type === 'img'" v-lazy="data.content"> -->
            <el-image v-if="props.data.type === 'img'" :src="data.path" :zoom-rate="1.2" :preview-src-list="imageList" :initial-index="index" fit="cover" preview-teleported hide-on-click-modal lazy style="width: 100%; height: 100%" draggable="false" />
            <div class="text" v-if="props.data.type === 'text'">
                <div class="text-inner">{{ data.content }}</div>
            </div>
            <div class="url" v-if="props.data.type === 'url'">{{ data.title }}</div>
        </div>
        <div class="favorite-card--body">
            <!-- <div class="favorite-card__title">
                <p class="ov-1" :title="props.data.title">{{ props.data.title }}</p>
            </div> -->
            <div class="favorite-card--desc">
                <p>{{ getTimeAgo(props.data.update_date) }}</p>
                <div class="favorite-card--footer">
                    <div class="flex-center" v-if="domain">
                        <el-image class="favicon" :src="domain.origin + '/favicon.ico'" lazy fit="cover" draggable="false">
                            <template #error>
                                <el-icon :size="18" color="slateblue">
                                    <MdiWeb />
                                </el-icon>
                            </template>
                        </el-image>
                        <a :href="props.data.origin" class="ov-1" :title="props.data.origin" target="_blank">{{ domain.host }}</a>
                    </div>
                    <div class="tool-bar">
                        <el-icon :size="18" class="edit">
                            <PhPenThin />
                        </el-icon>
                        <el-icon :size="18" class="edit" @click.stop="handleDel">
                            <EpDelete />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getTimeAgo, extractDomain, copyToClipboard } from '@/utils';
import { MdiWeb } from '@/components/Icon';
import useDragStore from '@/store/modules/useDragStore';
import { PhPenThin } from '@/components/Icon';
import * as Server from '@/service/model/api';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
const store = useDragStore();
const drag = ref(false);
const domain = ref(null);

const tempList = computed(() => store.favoriteList?.filter(item => item.type === 'img') || []);
const index = computed(() => tempList.value.findIndex(item => item.id === props.data.id) || 0);
const imageList = computed(() => tempList.value.map(item => item.path));

const dragstart = e => {
    drag.value = true;
    const { offsetX, offsetY } = e;
    // e.dataTransfer.setData('Text', '666');
    store.UPDATE_DRAG_DATA(props.data);
    setTimeout(() => {
        const element = document.querySelector('.favorite-card[dragging]');
        element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }, 0);
};
const dragend = e => {
    e.preventDefault();
    drag.value = false;
    store.UPDATE_DRAG_DATA(null);
};

const onPreviewClick = () => {
    const action = {
        text: () => {
            copyToClipboard(props.data.content, () => {
                ElMessage.success('已复制');
            });
        },
        url: () => {
            ElMessageBox.confirm(`是否前往${props.data.title}?`, '注意', {
                confirmButtonText: '立即前往',
                cancelButtonText: '取消'
            }).then(() => {
                window.open(props.data.content, '_blank');
            }).catch(() => { });
        }
    };
    console.log(props.data.type);
    if (action[props.data.type]) action[props.data.type]();
};

const handleDel = () => {
    ElMessageBox.confirm('确定要删除吗？ ', '', {
        confirmButtonText: '删除',
        cancelButtonText: '取消'
    }).then(async () => {
        const res = await Server.FavoriteUpdateUsePOST({
            id: props.data.id,
            is_show: 0
        });
        const { success, msg } = res;
        if (!success) {
            ElMessage.error(msg);
            return;
        }
        ElNotification({
            title: 'Success',
            message: '移除成功, 7天内可在回收站找回',
            type: 'success',
        });
        store.UPDATE_FAVORITE_LIST(store.favoriteList.filter(item => item.id !== props.data.id));
    }).catch(() => { });
};

onMounted(() => {
    domain.value = extractDomain(props.data.origin);
});
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
