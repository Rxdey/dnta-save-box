<template>
    <div class="favorite-card" :class="{ drag: drag }" draggable="true" @dragstart="dragstart" @dragend="dragend">
        <div class="drag-title ov-1">{{ props.data.title }}</div>
        <div class="favorite-card--preview">
            <!-- <img v-if="props.data.type === 'img'" v-lazy="data.content"> -->
            <el-image v-if="props.data.type === 'img'" :src="data.path" :zoom-rate="1.2" :preview-src-list="imageList" :initial-index="index" fit="cover" preview-teleported hide-on-click-modal lazy style="width: 100%; height: 100%;" draggable="false" />
            <div class="text" v-if="props.data.type === 'text'">{{ data.content }}</div>
            <div class="url" v-if="props.data.type === 'url'">{{ data.title }}</div>
        </div>
        <div class="favorite-card--body">
            <!-- <div class="favorite-card__title">
                <p class="ov-1" :title="props.data.title">{{ props.data.title }}</p>
            </div> -->
            <div class="favorite-card__desc">
                <p>{{ getTimeAgo(props.data.update_date) }}</p>
                <a :href="props.data.origin" class="ov-1" :title="props.data.origin" target="_blank">{{ extractDomain(props.data.origin) }}</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getTimeAgo, extractDomain } from '@/utils';


const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    favoriteList: {
        type: Array,
        default: () => []
    }
});

const drag = ref(false);


const tempList = computed(() => props.favoriteList?.filter(item => item.type === 'img') || []);
const index = computed(() => tempList.value.findIndex(item => item.id === props.data.id) || 0);
const imageList = computed(() => tempList.value.map(item => item.path));

const dragstart = (e) => {
    drag.value = true;
    const { offsetX, offsetY, target } = e;
    setTimeout(() => {
        const element = document.querySelector('.favorite-card[dragging]');
        element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }, 0);

};
const dragend = (e) => {
    drag.value = false;
}

</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
