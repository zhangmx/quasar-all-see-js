<template>
  <q-page class="flex flex-center">

    <CameraVideo v-for="camera in cameraList" :key="camera.title" v-bind="camera" @toggle-enabled="toggleCamera" />

  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { useCamerasStore } from 'stores/cameras';
import { storeToRefs } from 'pinia';
import CameraVideo from 'components/CameraVideo.vue';

export default defineComponent({
  name: 'IndexPage',

  components: {
    CameraVideo,
  },

  setup() {
    const store = useCamerasStore();
    const { cameraList } = storeToRefs(store)

    console.log(cameraList)

    // console.log($store)
    return {
      cameraList
    }
  }
});
</script>
