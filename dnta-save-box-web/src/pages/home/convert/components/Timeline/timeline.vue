<template>
    <div class="timeline" id="timeline">

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Timeline from './timeline';

const props = defineProps({
    options: {
        type: Object,
        default: () => ({
            totalTime: 10000,
        })
    }
});


onMounted(() => {
    const timeline = new Timeline('#timeline', {
        totalTime: 10000,
        onClick: (str, dateTime) => {
            console.log(str, dateTime);
        }
    });
    console.log(timeline);
})

</script>

<style lang="less" scoped>
.timeline {
    width: 100%;
    height: 100%;
    cursor: crosshair;
}
</style>
