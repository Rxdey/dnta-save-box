<template>
    <div class="canvas">
        <div class="canvasWrap"></div>
        <div class="time-line" id="timeline"></div>
        <div class="time-line" id="timeline2"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
// import DxCanvas from './canvas/canvas';
import TimeLine from '../home/convert/components/Timeline/timeline';
import TimeLine2 from '../home/convert/components/Timeline/timeline2';

onMounted(() => {
    new TimeLine2('#timeline2', {
        totalTime: 10000,
        // onClick: (str, dateTime) => {
        // }
    });
    new TimeLine('#timeline', {
        totalTime: 10000,
        // onClick: (str, dateTime) => {
        // }
    });
});
</script>

<style lang="less" scoped>
.canvas {
    width: 100%;
    height: 100%;
    background-color: #000;
    padding: 30px;
}
.time-line {
    width: 800px;
    height: 200px;
    background-color: #000;
}
</style>
