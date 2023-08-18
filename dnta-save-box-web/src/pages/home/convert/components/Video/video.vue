<template>
    <div class="video-player">
        <div class="video-player__wrap">
            <div class="video-player__menu">
                <MenuCom />
            </div>
            <div class="video-player__player">
                <div v-if="!!videoData" style="background-color: #000; height: 100%;" @click="onChangePlayStatus">
                    <video ref="video" id="video" :src="videoData.url" @loadedmetadata="onInit" @timeupdate="onTimeupdate" muted></video>
                </div>
                <Upload v-else v-model="videoData" />

                <div class="video-player--control" v-if="!!videoData">
                    <div class="control-wrap">
                        <span class="control-button" @click.stop="onChangePlayStatus">
                            <el-icon :size="60">
                                <v-icon icon="mdi:play" v-if="paused" />
                                <v-icon icon="mdi:pause" v-else />
                            </el-icon>
                        </span>
                        <span class="control-button" @click="onVolumeChange">
                            <el-icon :size="24">
                                <v-icon icon="mdi:volume-off" v-if="muted" />
                                <v-icon icon="mdi:volume-high" v-else />
                            </el-icon>
                            <div class="voice-line" @click.stop="onVoiceClick" :style="`--voice-width: ${volume * 100}%`"></div>
                        </span>
                    </div>

                    <div class="control-wrap">

                        <span class="control-button" title="移除" @click="onRemove">
                            <el-icon :size="24">
                                <v-icon icon="mdi:close" />
                            </el-icon>
                        </span>
                    </div>
                </div>
            </div>
            <div class="video-player__list">
                <List />
            </div>
        </div>
        <div class="video-player__timeline">
            <div id="timeline"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import Upload from '../Upload/upload.vue';
import MenuCom from './Menu.vue';
import List from './List.vue';
import { useVideo } from './useVideo';
import Timeline from '@/lib/timeline';

const videoData = ref(null);
const timeline = ref(null);
const { video, volume, paused, muted, register, onVolumeChange, onVoiceClick, onChangePlayStatus, setVideoTime } = useVideo();

const onInit = (e) => {
    register();
    video.value.volume = volume.value;
    if (timeline.value) return;
    const { duration } = video.value;
    timeline.value = new Timeline('#timeline', {
        totalTime: duration * 1000,
        onClick: (str, time) => {
            console.log(time);
            // 注意video是time时间单位是秒
            setVideoTime(time / 1000);
        },
        onLimitUpdate: (e) => {

        }
    });
    window.timeline = timeline.value;

};

/** 播放进度 */
const onTimeupdate = (e) => {
    timeline.value.play(Math.floor(e.target.currentTime * 1000));
};

const onRemove = () => {
    videoData.value = null;
    timeline.value.destory();
    timeline.value = null;
    paused.value = true;
    video.value = null;
};

onMounted(() => {

});
</script>
