<template>
    <div class="canvas">
        <div class="canvasWrap"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import DxCanvas from './canvas/canvas';

onMounted(() => {
    const node = new DxCanvas.Node();
    console.log(node);
});
</script>

<style lang="less" scoped></style>
