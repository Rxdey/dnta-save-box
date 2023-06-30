<template>
    <div class="PrePane" @click="onPreviewClick">
        <div class="nswf" v-if="data.type !== 'video'" @click.stop>
            <el-switch v-model="isNsfw" :inactive-value="1" size="small" style="--el-switch-on-color: #5dca91; --el-switch-off-color: #ff4242" :active-value="0" inline-prompt active-text="SFW" inactive-text="NSFW" @change="onNsfwChange" />
        </div>
        <div class="flex-center image-wrap" style="width: 100%;height: 100%;justify-content: center;" v-if="data.type === 'img'">
            <!-- <el-image :src="data.path" :zoom-rate="1.2" :preview-src-list="imageList" :initial-index="index" fit="cover" preview-teleported hide-on-click-modal lazy draggable="false" class="my-image">
                <template #placeholder>
                    <div class="img-loading">loading...</div>
                </template>
            </el-image> -->
            <CustomImage :src="data.thumbnailUrl" :preview="imageList" :initial-index="index"/>
        </div>
        <div class="text" v-if="data.type === 'text'">
            <div class="text-inner">{{ data.content }}</div>
        </div>
        <div class="url ov-1" v-if="data.type === 'url'">
            {{ data.title }}
        </div>
        <div class="video" v-if="data.type === 'video'">
            <div class="play-btn" @click="onPlay" v-if="!videoLoad">
                <el-icon class="play-icon" :size="60" color="#fff">
                    <MdiPlayCircle/>
                </el-icon>
            </div>
            <img v-if="!videoLoad" v-lazy="data.cover">
            <video v-else :src="data.videoPath" controls loop muted :poster="data.cover" autoplay></video>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { copyToClipboard } from '@/utils';
import * as Server from '@/service/model/api';
import useDragStore from '@/store/modules/useDragStore';
import { MdiPlayCircle, MdiPauseCircle } from '@/components/Icon';
import CustomImage from '@/components/CustomImage/CustomImage.vue';

const store = useDragStore();
const data = inject('favoriteData');
const isNsfw = ref(0);
const videoLoad = ref(false);

const tempList = computed(() => store.favoriteList?.filter(item => item.type === 'img') || []);
const index = computed(() => tempList.value.findIndex(item => item.id === data.value.id) || 0);
const imageList = computed(() => tempList.value.map(item => item.displayUrl));

const onPreviewClick = () => {
    const action = {
        text: () => {
            copyToClipboard(data.value.content, () => {
                ElMessage.success('已复制');
            });
        },
        url: () => {
            ElMessageBox.confirm(`是否前往${data.value.title}?`, '注意', {
                confirmButtonText: '立即前往',
                cancelButtonText: '取消'
            })
                .then(() => {
                    window.open(data.value.content, '_blank');
                })
                .catch(() => { });
        }
    };
    if (action[data.value.type]) action[data.value.type]();
};

const onNsfwChange = async val => {
    await Server.FavoriteUpdateUsePOST({
        id: data.value.id,
        nsfw: val
    });
};

const onPlay = () => {
    if (!videoLoad.value) {
        videoLoad.value = true;
    }
}

onMounted(() => {
    isNsfw.value = data.value.nsfw;
});
watch(
    () => data.value.nsfw,
    val => {
        isNsfw.value = val;
    }
);
</script>

<style lang="less"></style>
