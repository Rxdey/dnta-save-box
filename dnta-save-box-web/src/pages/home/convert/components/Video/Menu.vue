<template>
    <div class="Menu">
        <div class="menu-button" title="格式转换">
            <el-icon :size="24">
                <v-icon icon="ic:outline-transform" />
            </el-icon>
        </div>
        <div class="menu-button" title="gif制作" @click="onTransformat">
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

const props = defineProps({
    videoData: null
});
const ffmpegRef = new FFmpeg();

const load = async () => {
    // const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm';
    const baseURL = `${window.location.origin}/ffmpeg/core/dist/esm`;
    ffmpegRef.on('log', ({ message }) => {
        // console.log(message);
    });
    const res = await ffmpegRef.load({
        coreURL: `${baseURL}/ffmpeg-core.js`,
        wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });
    console.log(res);
};

const getImage = async () => {
    try {
        await ffmpegRef.writeFile(props.videoData.file.name, await fetchFile(props.videoData.file));
        //  -ss 00:00:10 -i video.mp4 -vframes 1 image.jpg
        // await ffmpegRef.exec(['-ss', '00:01:00', '-i', props.videoData.file.name, '-vframes', 1, '%d.jpg']);
        const res = await ffmpegRef.exec(['-ss', '00:01:00', '-i', props.videoData.file.name, '-vframes', 1, '%d.png']);
        console.log(res);
        const exportedFrames = await ffmpegRef.readFile('/');
        // const data = await ffmpegRef.readFile('img.jpeg');
        // console.log(URL.createObjectURL(new Blob([data.buffer], { type: 'image/jpeg' })));
        // for (let i = 1; i <= exportedFrames.length; i++) {
        //     let data = ffmpeg.FS('readFile', exportedFrames[i - 1]),
        //         imgEl = document.getElementById(`frame${i}`);
        //     imgEl.src = URL.createObjectURL(new Blob([data.buffer], { type: 'image/png' }));
        // };
        console.log(exportedFrames)
    } catch (error) {
        console.log(error);
    }
};
const emit = defineEmits(['gif']);
const onTransformat = async () => {
    getImage();
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
