<template>
  <q-card dark bordered class="bg-grey-9 my-card" v-if="enabled">
    <q-card-section>

      <video ref="videoPlayerElement" class="video-js" />

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

  methods: {
    toggleEnabled() {
      // console.log('Toggle enabled', this.enabled);
      this.$emit('update:enabled', !this.enabled);
    },
  },

  setup(props, context) {
    console.log('CameraLink', props.savedFolder)

    const link = 'https://www.youtube.com/embed/k3_tw44QsZQ?rel=0'

    const videoPlayer = videojs(context.refs.videoPlayerElement, options, () => {
      // this.player.log("onPlayerReady", this);
    });

    // videoPlayer.src({
    //   src: link,
    //   type: 'application/x-mpegURL'
    // });
    async function getCameraStream() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: props.deviceId } },
      });
      videoPlayer.srcObject = stream;
    }

    getCameraStream()

    return {
      link
    }
  }
});
</script>
