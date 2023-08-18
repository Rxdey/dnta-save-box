<template>
    <div class="timeline">
        <div class="time-line" id="timeline"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import TimeLine from './lib';

onMounted(() => {
    window.timeline = new TimeLine('#timeline', {
        onLimitUpdate: (limit) => {
            console.log(limit)
        }
    });
});

</script>

<style lang="less" scoped>
.timeline {
    width: 100%;
    height: 100%;
    background-color: #4e4d4d;
    padding: 16px;
}

.time-line {
    width: 100%;
    height: 150px;
    background-color: #161515;
    position: absolute;
    bottom: 0;
    left: 0;
    color: rgb(244, 81, 16);
}
</style>
