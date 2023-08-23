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
import { fetchFile } from '@ffmpeg/util';

const ffmpegRef = new FFmpeg();

const load = async () => {
    const baseURL = '@/lib/ffmpeg/core/esm';
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
        console.log(message);
    });
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
};

// const ffmpeg = createFFmpeg({
//   log: true,
//   corePath: '/path/to/@ffmpeg/ffmpeg-core.js', // 替换为正确的路径
//   wasmPath: '/path/to/@ffmpeg/ffmpeg.wasm', // 替换为正确的路径
// });

const emit = defineEmits(['gif']);
const onTransformat = () => {
    load();
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
