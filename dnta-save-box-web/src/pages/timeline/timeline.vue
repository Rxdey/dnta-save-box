<template>
    <div class="timeline">
        <div class="time-line" id="timeline"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import TimeLine from './lib';

onMounted(() => {
    new TimeLine('#timeline', {
        totalTime: 10000,
    });
});

</script>

<style lang="less" scoped>
.timeline {
    width: 100%;
    height: 100%;
    background-color: #000;
    padding: 16px;
}

.time-line {
    width: 100%;
    height: 200px;
    background-color: #000;
}
</style>
