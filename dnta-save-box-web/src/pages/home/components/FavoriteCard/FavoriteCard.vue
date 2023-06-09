<template>
    <div class="favorite-card" :class="{ 'drag': drag, 'video-card': props.data.type === 'video' }" :draggable="props.data.type !== 'video'" @dragstart="dragstart" @dragend="dragend">
        <div class="drag-title ov-1">{{ props.data.title }}</div>
        <PrePane class="favorite-card--preview" />
        <ToolPane class="favorite-card--desc"/>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, provide } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useDragStore from '@/store/modules/useDragStore';
import PrePane from './PrePane.vue';
import ToolPane from './ToolPane.vue';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});

provide('favoriteData', props.data);
const store = useDragStore();
const drag = ref(false);


const dragstart = e => {
    if (props.data.type === 'video') return;
    drag.value = true;
    const { offsetX, offsetY } = e;
    store.UPDATE_DRAG_DATA(props.data);
    setTimeout(() => {
        const element = document.querySelector('.favorite-card[dragging]');
        element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }, 0);
};
const dragend = e => {
    if (props.data.type === 'video') return;
    drag.value = false;
    store.UPDATE_DRAG_DATA(null);
};

</script>

<style lang="less">
</style>
