<template>
  <q-card dark bordered class="bg-grey-9 my-card" v-show="enabled">
    <q-card-section>

      <video :id="videoElementId" class="video-js vjs-default-skin" playsinline></video>

      <div class="text-h6">{{ label }}</div>
      <div class="text-subtitle2">{{ label }}</div>
    </q-card-section>

    <q-separator dark inset />

    <q-card-section>
      {{ savedFolder }}
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue';
import 'video.js/dist/video-js.css'
import 'videojs-record/dist/css/videojs.record.css'
import videojs from 'video.js';

import 'webrtc-adapter'
import RecordRTC from 'recordrtc'

// eslint-disable-next-line no-unused-vars
import Record from 'videojs-record/dist/videojs.record.js'

export default defineComponent({
  name: 'CameraLink',
  props: {
    deviceId: {
      type: String,
      required: true,
    },

    groupId: {
      type: String,
      default: '',
    },

    id: {
      type: String,
      default: '',
    },

    isCustomLabel: {
      type: Boolean,
      default: false,
    },

    enabled: {
      type: Boolean,
      default: false,
    },

    kind: {
      type: String,
      default: '#',
    },

    label: {
      type: String,
      default: '',
    },

    savedFolder: {
      type: String,
      default: '',
    }
  },

  // data() {
  //   return {
  //     player: null,
  //   }
  // },

  methods: {
    toggleEnabled() {
      // console.log('Toggle enabled', this.enabled);
      this.$emit('update:enabled', !this.enabled);
    },
  },

  mounted() {

  },
  setup(props, context) {
    console.log('CameraLink ==> ', props.savedFolder)

    // const link = 'https://www.youtube.com/embed/k3_tw44QsZQ?rel=0'

    const videoElementId = computed(() => 'id' + props.id.slice(2, 10))

    let player;

    // const player = videojs('videoPlayerElement', options, () => {
    //   // this.player.log("onPlayerReady", this);
    //   const msg = 'Using video.js ' + videojs.VERSION
    //     + ' with videojs-record ' + videojs.getPluginVersion('record')
    //     + ' and recordrtc ' + RecordRTC.version;
    //   videojs.log(msg);
    // });

    onMounted(() => {
      console.log('onMounted')
      console.log(videoElementId.value)
      console.log('deviceId', props.deviceId)

      const options = {
        controls: true,
        width: 320,
        height: 240,
        fluid: false,
        bigPlayButton: false,
        controlBar: {
          volumePanel: false
        },
        plugins: {
          record: {
            audio: false,
            video: {
              // video constraints: use preset device
              deviceId: { exact: props.deviceId }
            },
            maxLength: 10,
            displayMilliseconds: false,
            debug: true
          }
        }
      };

      player = videojs(videoElementId.value, options, () => {
        // this.player.log("onPlayerReady", this);
        const msg = 'Using video.js ' + videojs.VERSION
          + ' with videojs-record ' + videojs.getPluginVersion('record')
          + ' and recordrtc ' + RecordRTC.version;
        videojs.log(msg);
      });
      // videoPlayer.src({
      //   src: link,
      //   type: 'application/x-mpegURL'
      // });

      // const deviceId = props.deviceId;

      // async function getCameraStream() {
      //   const stream = await navigator.mediaDevices.getUserMedia({
      //     video: { deviceId: { exact: props.deviceId } },
      //   });
      //   player.srcObject = stream;
      // }

      // getCameraStream()

      // device is ready
      player.on('deviceReady', () => {
        console.log('device is ready!');
      });

      // user clicked the record button and started recording
      player.on('startRecord', () => {
        console.log('started recording!');
      });

      // user completed recording and stream is available
      player.on('finishRecord', () => {
        // the blob object contains the recorded data that
        // can be downloaded by the user, stored on server etc.
        console.log('finished recording: ', this.player.recordedData);
      });

      // error handling
      player.on('error', (element, error) => {
        console.warn(error);
      });

      player.on('deviceError', () => {
        console.error('device error:', this.player.deviceErrorCode);
      });
    })

    return {
      videoElementId
    }
  }
});
</script>
