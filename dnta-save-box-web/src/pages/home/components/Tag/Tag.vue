<template>
    <div class="tag" :class="{ active: props.active }" @dragenter="dragenter" @dragleave="dragleave">
        <div class="tag-item flex-center">
            <el-icon :size="20" class="icon" @click.stop="onLeftClick">
                <slot></slot>
            </el-icon>
            <span class="tag-label">
                {{ props.label }}
                <slot name="label"></slot>
            </span>
            <el-icon :size="18" v-if="props.edit" class="edit" @click.stop="onEdit">
                <PhPenThin />
            </el-icon>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PhPenThin } from '@/components/Icon';

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
    }
});
const isCurrent = ref(false);
const emit = defineEmits(['onLeftClick', 'onEdit']);

const onLeftClick = () => {
    emit('onLeftClick');
};
const onEdit = () => {
    emit('onEdit');
};

const dragenter = (e) => {
    if (!props.drag) return;
    e.target.toggleAttribute('over',true);
}
const dragleave = (e) => {
    if (!props.drag) return;
    e.target.toggleAttribute('over',false);
}

</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
