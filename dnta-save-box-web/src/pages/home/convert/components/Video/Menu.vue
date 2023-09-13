<template>
    <div class="Menu">
        <div class="menu-button" :class="{ loading }" title="gif制作" @click="onToGif">
            <el-icon :size="24">
                <v-icon icon="ic:baseline-gif" />
            </el-icon>
        </div>
        <div class="menu-button" :class="{ loading }" title="格式转换" @click="onTransformat">
            <el-icon :size="24">
                <v-icon icon="material-symbols:switch-video-outline-rounded" />
            </el-icon>
        </div>
    </div>
</template>

<script setup>
/** 启用sharedArrayBuffer 需要设置跨域隔离。。。暂时放弃*/
import { ref, onMounted, computed, watch } from 'vue';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { downLoadFile } from '@/utils';

const props = defineProps({
    videoData: null
});
const loading = ref(false);
const ffmpeg = new FFmpeg();

const load = async () => {
    // const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm';
    const baseURL = `${window.location.origin}/@ffmpeg/core-mt@0.12.3/dist/esm`;
    ffmpeg.on('log', ({ message }) => {
        // console.log(message);
    });
    ffmpeg.on('progress', (arg) => {
        console.log(arg);
    });
    const res = await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
    });
    console.log(res);
};

const emit = defineEmits(['loading']);

const setLoading = (v = false) => {
    loading.value = v;
    emit('loading', v);
};
// 转换格式
const onTransformat = async () => {
    if (loading.value) return;
    setLoading(true);
    try {
        await ffmpeg.writeFile(props.videoData.file.name, await fetchFile(props.videoData.url));
        await ffmpeg.exec(['-i', props.videoData.file.name, '-preset', 'ultrafast', 'output.mp4']);
        await ffmpeg.deleteFile(props.videoData.file.name);
        const data = await ffmpeg.readFile('output.mp4');
        const res = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        const name = props.videoData.file.name.split('.');
        name.splice(name.length, 1);
        await ffmpeg.deleteFile('output.mp4');
        downLoadFile(res, `${name.join('.')}.mp4`);
    } catch (error) {
        console.log(error);
    }
    setLoading(false);
};
// gif
const onToGif = async () => {
    if (loading.value) return;
    setLoading(true);
    try {
        await ffmpeg.writeFile(props.videoData.file.name, await fetchFile(props.videoData.url));
        // ffmpeg -ss 10 -t 3 -i ./469818777-1-208.mp4 -f gif ./gif/output.gif
        // 注: 参数要传字符串
        await ffmpeg.exec([
            '-ss', '00:00:10.100', '-to', '00:00:15.250', '-i',
            props.videoData.file.name,
            '-vf', 'fps=15,scale=1280:-1',
            'output.gif'
        ]);
        const data = await ffmpeg.readFile('output.gif');
        const res = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
        const name = props.videoData.file.name.split('.');
        name.splice(name.length, 1);
        // downLoadFile(res, `${name.join('.')}.jpg`);
        window.open(res, '_blank');
    } catch (error) {
        console.log(error);
    }
    setLoading(false);
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

    &.loading {
        cursor: not-allowed;
    }

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
