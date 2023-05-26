<template>
  <q-card dark bordered class="bg-grey-9 my-card" v-show="enabled">
    <q-card-section>

      <video id="videoPlayerElement" class="video-js" />

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
import { defineComponent } from 'vue';
import videojs from 'video.js';
import 'webrtc-adapter'
import RecordRTC from 'recordrtc'
// eslint-disable-next-line no-unused-vars
import Record from 'videojs-record/dist/videojs.record.js'

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
      video: true,
      maxLength: 10,
      displayMilliseconds: false,
      debug: true
    }
  }
};

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

  data() {
    return {
      player: null,
    }
  },

  methods: {
    toggleEnabled() {
      // console.log('Toggle enabled', this.enabled);
      this.$emit('update:enabled', !this.enabled);
    },
  },

  mounted() {
    this.player = videojs('videoPlayerElement', options, () => {
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

    const deviceId = this.props.deviceId

    async function getCameraStream(deviceId) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
      });
      this.player.srcObject = stream;
    }

    getCameraStream(deviceId)

    // device is ready
    this.player.on('deviceReady', () => {
      console.log('device is ready!');
    });

    // user clicked the record button and started recording
    this.player.on('startRecord', () => {
      console.log('started recording!');
    });

    // user completed recording and stream is available
    this.player.on('finishRecord', () => {
      // the blob object contains the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished recording: ', this.player.recordedData);
    });

    // error handling
    this.player.on('error', (element, error) => {
      console.warn(error);
    });

    this.player.on('deviceError', () => {
      console.error('device error:', this.player.deviceErrorCode);
    });
  },
  setup(props, context) {
    console.log('CameraLink', props.savedFolder)

    const link = 'https://www.youtube.com/embed/k3_tw44QsZQ?rel=0'

    return {
      link
    }
  }
});
</script>
