<template>
    <div class="CustomImage" @click="initViewer">
        <img v-lazy="src" draggable="false">
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Viewer from 'viewerjs';

const props = defineProps({
    src: {
        type: String,
        default: ''
    },
    preview: {
        type: Object,
        default: () => []
    },
    initialIndex: {
        type: Number,
        default: 0
    }
});

const initViewer = () => {
    if (!props.preview.length) return;
    const container = document.createElement('div'); // 创建一个容器元素
    props.preview.forEach(item => {
        var img = document.createElement('img');
        img.setAttribute('src', item);
        img.setAttribute('data-src', item);
        container.appendChild(img);
    });
    // console.log(imageList)
    const viewer = new Viewer(container, {
        initialViewIndex: props.initialIndex,
        // inline: true,
    });
    viewer.show();
};

onMounted(() => {
});

</script>

<style lang="less" scoped>
.CustomImage {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
    background-image: linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0, #eee), linear-gradient(45deg, #eee 25%, #fff 0, #fff 75%, #eee 0, #eee);
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
