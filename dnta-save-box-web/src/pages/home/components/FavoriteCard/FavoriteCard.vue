<template>
    <div class="favorite-card" :class="{ 'drag': drag, 'video-card': props.data.type === 'video' }" :draggable="props.data.type !== 'video'" @dragstart="dragstart" @dragend="dragend" @dragenter="dragenter" @dragleave="dragleave" @dragover="dragover" @drop="onDrop" :drag-over="dragPosition">
        <CusCheckBox />
        <div class="drag-title ov-1" :class="{ 'no-events': dragIn }">{{ props.data.title }}</div>
        <PrePane class="favorite-card--preview" :class="{ 'no-events': dragIn }" />
        <ToolPane class="favorite-card--desc" :class="{ 'no-events': dragIn }" />
    </div>
</template>

<script setup>
import { ref, computed, watch, reactive, provide } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useDragStore from '@/store/modules/useDragStore';
import PrePane from './PrePane.vue';
import ToolPane from './ToolPane.vue';
import CusCheckBox from '@/components/Field/CheckBox.vue'
import { throttle } from 'lodash';
import { hasClass, moveObjectElement } from '@/utils';
import * as Server from '@/service/model/api';


const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});


provide('favoriteData', computed(() => props.data));
const store = useDragStore();
const checked = ref(false);
const drag = ref(false);
const dragPosition = ref('');

const dragIn = computed(() => store.dragIn);
const dragData = computed(() => store.dragData);

const clearAttr = () => {
    Array.from(document.querySelectorAll('div[drag-over]')).forEach(item => {
        item.toggleAttribute('drag-over', false);
    });
    dragPosition.value = '';
};
// drag
const dragstart = e => {
    if (props.data.type === 'video') return;
    store.UPDATE_DRAGIN(true); // 开始拖拽
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
    store.UPDATE_DRAG_DATA(null);
    store.UPDATE_DRAGIN(false); // 结束拖拽
    // dragover拖拽期间不会停止，防止结束时作用到自身，并在drop取值
    setTimeout(() => {
        drag.value = false;
        clearAttr();
    }, 0);

};

// drop
const dragover = (e) => {
    e.preventDefault();
    const { target, layerX } = e;
    if (hasClass(target, 'drag')) return;
    if (layerX <= target.clientWidth && layerX >= 0) {
        if (layerX > target.clientWidth / 2) {
            if (dragPosition.value !== 'right') dragPosition.value = 'right';
        } else {
            if (dragPosition.value !== 'left') dragPosition.value = 'left';
        }
    } else {
        if (dragPosition.value) dragPosition.value = '';
    }
};

const dragenter = (e) => {
    e.preventDefault();
};
const dragleave = (e) => {
    e.preventDefault();
    const { target } = e;
    dragPosition.value = '';
};
const onDrop = async (e) => {
    e.preventDefault();
    // console.log(dragPosition.value, props.data.id, dragData.value);
    console.log(`${dragData.value.id} 放置到 ${props.data.id} ${dragPosition.value === 'left' ? '前' : '后'}`);
    if (dragData.value.id === props.data.id) return;
    const params = {
        id: dragData.value.id,
        targetId: props.data.id,
        position: dragPosition.value === 'left' ? 1 : 0,
        dragPosition: dragPosition.value
    };
    const res = await Server.FavoriteSoreUsePOST(params);
    const { success, data } = res;
    if (!success) {
        return;
    }
    store.UPDATE_FAVORITE_LIST(moveObjectElement(store.favoriteList, params.id, params.targetId, params.dragPosition));

}

</script>

<style lang="less"></style>
