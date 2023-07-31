<template>
  <q-card dark bordered class="bg-grey-9 my-card" v-show="enabled">
    <q-card-section>

      <video :id="videoElementId" class="video-js vjs-default-skin" playsinline :width="maxWidth"
        :height="maxHeight"></video>

      <div class="text-h6">{{ cameraName }}</div>

    </q-card-section>

    <q-separator dark inset />

    <q-card-section>
      {{ lastSavedFilePath }}
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, computed, onMounted, ref, onBeforeUnmount } from 'vue';
import 'video.js/dist/video-js.css'
import 'videojs-record/dist/css/videojs.record.css'
import videojs from 'video.js';

import 'webrtc-adapter'
import RecordRTC from 'recordrtc'

// eslint-disable-next-line no-unused-vars
import Record from 'videojs-record/dist/videojs.record.js'
// eslint-disable-next-line no-unused-vars
import TsEBMLEngine from 'videojs-record/dist/plugins/videojs.record.ts-ebml.js';
import { saveVideo } from '../backend/utils.js'

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

    maxWidth: {
      type: Number,
      default: 1280 / 3,
    },

    maxHeight: {
      type: Number,
      default: 720 / 3,
    },

    name: {
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
      this.$emit('update:enabled', !this.enabled);
    },
  },

  setup(props, context) {
    const videoElementId = computed(() => 'id' + props.id.slice(2, 10))
    const lastSavedFilePath = ref('')

    const cameraName = computed(() => {
      return props.name || props.label;
    });

    let player;

    onMounted(() => {
      const options = {
        controls: true,
        loop: false,
        autoplay: false,
        width: props.maxWidth,
        height: props.maxHeight,
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
            maxLength: 60 * 60,
            displayMilliseconds: false,
            convertEngine: 'ts-ebml',
            debug: true
          }
        }
      };

      player = videojs(videoElementId.value, options, () => {
        const msg = 'Using video.js ' + videojs.VERSION
          + ' with videojs-record ' + videojs.getPluginVersion('record')
          + ' and recordrtc ' + RecordRTC.version;
        videojs.log(msg);
      });

      // device is ready
      player.on('deviceReady', () => {
        console.log('device is ready!');
      });

      // user clicked the record button and started recording
      player.on('startRecord', () => {
        console.log('started recording!');
      });

      // user completed recording and stream is available
      // player.on('finishRecord', async () => {
      //   // the blob object contains the recorded data that
      //   // can be downloaded by the user, stored on server etc.
      //   function blobToArrayBuffer(blob) {
      //     return new Promise((resolve, reject) => {
      //       const reader = new FileReader();
      //       reader.onload = () => resolve(reader.result);
      //       reader.onerror = reject;
      //       reader.readAsArrayBuffer(blob);
      //     });
      //   }

      //   // 生成文件名
      //   const filename = (cameraName.value + new Date().toISOString()).replace(/[^a-z0-9]/gi, '_') + '.webm';

      //   const blob = new Blob([player.recordedData]);
      //   const arrayBuffer = await blobToArrayBuffer(blob);
      //   const filePath = await saveVideo(props.savedFolder, filename, arrayBuffer);

      //   lastSavedFilePath.value = filePath;
      // });

      // user completed recording and stream is available
      player.on('finishConvert', async () => {
        // the blob object contains the recorded data that
        // can be downloaded by the user, stored on server etc.
        function blobToArrayBuffer(blob) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
          });
        }

        // 生成文件名
        const filename = (cameraName.value + new Date().toISOString()).replace(/[^a-z0-9]/gi, '_') + '.mp4';

        const blob = new Blob([player.convertedData]);
        const arrayBuffer = await blobToArrayBuffer(blob);
        const filePath = await saveVideo(props.savedFolder, filename, arrayBuffer);

        lastSavedFilePath.value = filePath;
      });

      // error handling
      player.on('error', (element, error) => {
        console.warn(error);
      });

      player.on('deviceError', () => {
        console.error('device error:', player.deviceErrorCode);
      });
    });

    onBeforeUnmount(() => {
      if (player) {
        player.dispose()
      }
    });

    return {
      videoElementId,
      cameraName,
      lastSavedFilePath
    }
  }
});
</script>
