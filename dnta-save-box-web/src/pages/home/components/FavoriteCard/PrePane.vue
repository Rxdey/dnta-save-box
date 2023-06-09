<template>
    <div class="PrePane" @click="onPreviewClick">
        <div class="nswf">
            <el-switch 
                v-model="isNsfw" 
                :inactive-value="1" 
                size="small" 
                style="--el-switch-on-color: #5dca91; --el-switch-off-color: #ff4242" 
                :active-value="0" 
                inline-prompt 
                active-text="SFW" 
                inactive-text="NSFW" 
                @change="onNsfwChange" 
                />
        </div>
        <div class="flex-center" style="width: 100%;height: 100%;justify-content: center;">
            <el-image 
                v-if="data.type === 'img'" 
                :src="data.path" 
                :zoom-rate="1.2" 
                :preview-src-list="imageList" 
                :initial-index="index" 
                fit="cover" 
                preview-teleported 
                hide-on-click-modal 
                lazy 
                
                draggable="false" 
                />
        </div>
        <div class="text" v-if="data.type === 'text'">
            <div class="text-inner">{{ data.content }}</div>
        </div>
        <div class="url" v-if="data.type === 'url'">
            {{ data.title }}
        </div>
        <div class="video" v-if="data.type === 'video'">
            <video :src="data.path" controls loop muted preload="none"></video>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { copyToClipboard } from '@/utils';
import * as Server from '@/service/model/api';
import useDragStore from '@/store/modules/useDragStore';

const store = useDragStore();
const data = inject('favoriteData');
const isNsfw = ref(0);
const tempList = computed(() => store.favoriteList?.filter(item => item.type === 'img') || []);
const index = computed(() => tempList.value.findIndex(item => item.id === data.id) || 0);
const imageList = computed(() => tempList.value.map(item => item.path));

const onPreviewClick = () => {
    const action = {
        text: () => {
            copyToClipboard(data.content, () => {
                ElMessage.success('已复制');
            });
        },
        url: () => {
            ElMessageBox.confirm(`是否前往${data.title}?`, '注意', {
                confirmButtonText: '立即前往',
                cancelButtonText: '取消'
            })
                .then(() => {
                    window.open(data.content, '_blank');
                })
                .catch(() => { });
        }
    };
    if (action[data.type]) action[data.type]();
};

const onNsfwChange = async val => {
    await Server.FavoriteUpdateUsePOST({
        id: data.id,
        nsfw: val
    });
};

onMounted(() => {
    isNsfw.value = data.nsfw;
});
watch(
    () => data.nsfw,
    val => {
        isNsfw.value = val;
    }
);
</script>

<style lang="less">
</style>
