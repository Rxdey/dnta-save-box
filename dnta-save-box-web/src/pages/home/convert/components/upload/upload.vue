<template>
    <div class="upload" @drop="onDrop" @dragleave="onDragleave" @dragenter="onDragenter" @click="onClick">
        {{ props.label }}
        <input type="file" ref="fileInput" multiple hidden @change="onFileChange">
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useDrag } from '../../../upload/useDrag';

const props = defineProps({
    label: {
        type: String,
        default: 'click/drag to upload'
    },
    modelValue: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['change', 'update:modelValue']);
const fileInput = ref(null);
const videoFile = ref({});

const vaildFile = (files) => {
    const fileList = Array.from(files);
    if (!fileList.length) return;
    if (fileList.every(item => !/^video/.test(item.type))) {
        ElMessage.error('请不要上传非视频文件');
        return;
    }
    videoFile.value = {
        url: window.URL.createObjectURL(files[0]),
        file: files[0]
    };
    emit('change', videoFile.value);
};
const { uploadLoading, onDrop, onDragleave, onDragenter, onFileChange } = useDrag(vaildFile);

const onClick = () => {
    if (uploadLoading.value) return;
    fileInput.value.value = '';
    fileInput.value.click();
};

watch(() => videoFile.value, (val) => {
    emit('update:modelValue', val);
})
watch(() => props.modelValue, (val) => {
    videoFile.value = val;
})


</script>

<style lang="less" scoped>
.upload {
    font-size: 32px;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #989898;
}
</style>
