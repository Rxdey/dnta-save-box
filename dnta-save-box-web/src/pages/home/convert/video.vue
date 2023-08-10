<template>
    <div class="video-player">
        <div class="video-player__wrap">
            <div class="video-player__player">
                <div v-if="!!videoData" style="background-color: #000; height: 100%;" @click="onChangePlayStatus">
                    <video ref="video" id="video" :src="videoData.url" muted @loadedmetadata="onInit" @ended="onEnded" @play="onPlay" @pause="onPause" @timeupdate="onTimeupdate"></video>
                </div>
                <Upload v-else v-model="videoData" />
            </div>
            <div class="video-player__control" v-if="!!videoData">
                <span class="control-button" @click.stop="onChangePlayStatus">
                    <el-icon :size="50">
                        <v-icon icon="mdi:play" v-if="paused" />
                        <v-icon icon="mdi:pause" v-else />
                    </el-icon>
                </span>
                <span class="control-button" title="移除" @click="onRemove">
                    <el-icon :size="50">
                        <v-icon icon="mdi:close-thick" color="#f00"/>
                    </el-icon>
                </span>
            </div>
        </div>
        <div class="video-player__timeline">
            <div id="timeline"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Timeline from './components/Timeline/timeline';
import Upload from './components/upload/upload.vue';

const videoData = ref(null);
const timeline = ref(null);
const video = ref(null);
const paused = ref(true);

const onChangePlayStatus = () => {
    if (video.value.paused) {
        video.value.play();
    } else {
        video.value.pause();
        paused.value = true;
    }
};

const onInit = () => {
    console.log('ready')
    if (timeline.value) return;
    const { duration } = video.value;
    timeline.value = new Timeline('#timeline', {
        totalTime: duration * 1000,
        onClick: (str, dateTime) => {
            console.log(str)
            timeline.value.update(dateTime)
            setVideoTime(dateTime / 1000);
        }
    });
    window.timeline = timeline.value
};
/** 跳转进度 */
const setVideoTime = (time = 0) => {
    video.value.pause();
    video.value.currentTime = time;
    if (!paused.value)video.value.play();
}
/** 播放进度 */
const onTimeupdate = (e) => {
    // console.log()
    timeline.value.update(Math.floor(e.target.currentTime * 1000))
};
const onEnded = () => {
    paused.value = true;
};
const onPlay = () => {
    paused.value = false;
};
const onPause = () => {
    paused.value = true;
};
const onRemove = () => {
    videoData.value = null;
    timeline.value.destroy();
    timeline.value = null;
    paused.value = true;
    video.value = null;
}
</script>
