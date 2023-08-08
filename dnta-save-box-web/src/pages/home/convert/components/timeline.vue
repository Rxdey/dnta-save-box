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

const timeline = ref(null);
const width = ref(0);

onMounted(() => {
    timeline.value = new Timeline({
        root: '#timeline'
    });
    console.log(timeline.value);
})

</script>

<style lang="less" scoped>
.timeline {
    width: 100%;
    height: 100%;
}
</style>
