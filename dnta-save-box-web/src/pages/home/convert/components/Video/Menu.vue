<template>
    <div class="Menu">
        <div class="menu-button" title="格式转换" @click="onTransformat">
            <el-icon :size="24">
                <v-icon icon="ic:outline-transform" />
            </el-icon>
        </div>
        <div class="menu-button" title="gif制作">
            <el-icon :size="24" @click="emit('gif')">
                <v-icon icon="ic:baseline-gif" />
            </el-icon>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { FFmpeg } from '@ffmpeg/ffmpeg';

const emit = defineEmits(['gif']);
const onTransformat = () => {
}

</script>

<style lang="less" scoped>
.menu-button {
    height: 50px;
    cursor: pointer;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    position: relative;
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 20%;
        right: 20%;
        height: 1px;
        background-color: rgb(41, 45, 58);
    }
    &:hover {
        background-color: #333;
    }
}
</style>
