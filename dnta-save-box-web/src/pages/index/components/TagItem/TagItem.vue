<template>
    <div class="tag" :class="{ active: props.active }" @dragenter="dragenter" @dragleave="dragleave" @drop="onDrop">
        <div class="tag-item flex-center" :class="{ 'no-events': drag }">
            <el-icon :size="20" class="icon" @click.stop="onLeftClick">
                <slot></slot>
                <component :is="customIcons" v-if="props.icon" />
            </el-icon>
            <span class="tag-label">
                {{ props.label }}
                <slot name="label"></slot>
                <span class="count">{{ props.count }}</span>
            </span>
        </div>
        <el-icon :size="18" v-if="props.edit" class="edit" @click.stop="onEdit">
            <PhPenThin />
        </el-icon>
    </div>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted } from 'vue';
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
    },
    count: {
        type: [Number, String],
        default: ''
    },
    icon: {
        type: String,
        default: ''
    }
});

const store = useDragStore();
// 当前目录判断
const isCurrent = ref(false);
let customIcons = null;
// 动态加载
if (props.icon) {
    const globModules = import.meta.glob('@/components/Icon/*.vue');
    const current = globModules[`/src/components/Icon/${props.icon}.vue`];
    customIcons = defineAsyncComponent(current);
}

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
    // 当多选的时候出发
    if (store.checkList && store.checkList.length > 1) {
        try {
            await ElMessageBox.confirm(`确定要把当前选中的 ${store.checkList.length} 项全部移动到此分类吗？`, '', {
                confirmButtonText: '移动',
                cancelButtonText: '取消'
            });
        } catch (error) {
            return;
        }
    };
    const params = {
        ids: [temp.id],
        tid: props.id,
    };
    if (store.checkList.length > 1) {
        params.ids = store.checkList.map(item => item.id);
    }
    // TODO => 修改分类列表
    const res = await Server.FavoriteUpdateUsePOST(params);
    const { success, msg } = res;
    if (!success) {
        ElMessage.error(msg);
        return;
    }
    ElNotification({
        title: '操作成功',
        message: `已移动到 ${props.label}`,
        type: 'success',
    });
    // 更新列表
    store.UPDATE_DRAG_DATA(null);
    store.UPDATE_CHECK_LIST([]);
    // 全部标签下拖拽不移除原数组
    if (store.active !== -1) {
        store.UPDATE_FAVORITE_LIST(store.favoriteList.filter(item => !params.ids.includes(item.id)));
    }
};

</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
