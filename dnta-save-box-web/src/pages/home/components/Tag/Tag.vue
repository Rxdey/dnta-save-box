<template>
    <div class="tag" :class="{ active: props.active }" @dragenter="dragenter" @dragleave="dragleave" @drop="onDrop">
        <div class="tag-item flex-center" :class="{ 'no-events': drag }">
            <el-icon :size="20" class="icon" @click.stop="onLeftClick">
                <slot></slot>
            </el-icon>
            <span class="tag-label">
                {{ props.label }}
                <slot name="label"></slot>
            </span>
        </div>
        <el-icon :size="18" v-if="props.edit" class="edit" @click.stop="onEdit">
            <PhPenThin />
        </el-icon>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PhPenThin } from '@/components/Icon';
import useDragStore from '@/store/modules/useDragStore';
import * as Server from '@/service/model/api';

const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: false
    },
    edit: {
        type: Boolean,
        default: false
    },
    drag: {
        type: Boolean,
        default: false
    },
    id: {
        type: [Number, String],
        default: ''
    }
});

const store = useDragStore();
// 当前目录判断
const isCurrent = ref(false);

const emit = defineEmits(['onLeftClick', 'onEdit']);
const onLeftClick = () => {
    emit('onLeftClick');
};
const onEdit = () => {
    emit('onEdit');
};

const dragenter = (e) => {
    e.preventDefault();
    isCurrent.value = store.dragData?.tid === props.id;
    if (!props.drag || isCurrent.value) return;
    e.target.toggleAttribute('over', true);
};
const dragleave = (e) => {
    e.preventDefault();
    if (!props.drag || isCurrent.value) return;
    e.target.toggleAttribute('over', false);
};
const onDrop = async (e) => {
    e.preventDefault();
    e.target.toggleAttribute('over', false);
    if (!props.drag || isCurrent.value || !store.dragData) return;
    const temp = JSON.parse(JSON.stringify(store.dragData));
    const params = {
        id: temp.id,
        tid: props.id,
        // type: temp.type
    };    
    // TODO => 修改分类列表
    const res = await Server.FavoriteUpdateUsePOST(params);
    const { success, msg } = res;
    if (!success) {
        ElMessage.error(msg);
        return;
    }
    ElNotification({
        title: 'Success',
        message: `已移动到 ${props.label}`,
        type: 'success',
    });
    // 更新列表
    store.UPDATE_DRAG_DATA(null);
    // 全部标签下拖拽不移除原数组
    if (store.active !== -1) store.UPDATE_FAVORITE_LIST(store.favoriteList.filter(item => item.id !== params.id));
}

</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
