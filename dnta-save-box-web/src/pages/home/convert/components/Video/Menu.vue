<template>
    <div class="Menu">
        <div class="menu-button" title="格式转换">
            <el-icon :size="24">
                <v-icon icon="ic:outline-transform" />
            </el-icon>
        </div>
        <div class="menu-button" title="gif制作" @click="onToGif">
            <el-icon :size="24">
                <v-icon icon="ic:baseline-gif" />
            </el-icon>
        </div>
        <div class="menu-button" title="格式转换" @click="onTransformat">
            <el-icon :size="24">
                <v-icon icon="material-symbols:switch-video-outline-rounded" />
            </el-icon>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { downLoadFile } from '@/utils';

const props = defineProps({
    videoData: null
});
const ffmpeg = new FFmpeg();

const load = async () => {
    // const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm';
    const baseURL = `${window.location.origin}/@ffmpeg/core-mt@0.12.3/dist/esm`;
    // ffmpeg.on('log', (arg) => {

    // });
    ffmpeg.on('progress', (arg) => {
        console.log(arg);
    });
    const res = await ffmpeg.load({
        coreURL: `${baseURL}/ffmpeg-core.js`,
        wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });
    console.log(res);
};

const emit = defineEmits(['loading']);

// 转换格式
const onTransformat = async () => {
    emit('loading', true);
    try {
        const v = await ffmpeg.writeFile(props.videoData.file.name, await fetchFile(props.videoData.url));
        const o = await ffmpeg.exec(['-i', props.videoData.file.name, '-preset', 'ultrafast', 'output.mp4']);
        const data = await ffmpeg.readFile('output.mp4');
        const res = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        const name = props.videoData.file.name.split('.');
        name.splice(name.length, 1);
        downLoadFile(res, `${name.join('.')}.mp4`);
        emit('loading', false);
    } catch (error) {
        console.log(error);
        emit('loading', false);
    }
};
// gif
const onToGif = async () => {

};
onMounted(() => {
    load();
});
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
