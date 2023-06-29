<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Allsee App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          All cameras
        </q-item-label>

        <CameraLink v-for="camera in cameraLinks" :key="camera.deviceId" v-bind="camera" @toggle-enabled="toggleCamera"
          @update-name="updateName" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import CameraLink from 'components/CameraLink.vue';
import { useCamerasStore } from 'stores/cameras';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'MainLayout',

  components: {
    CameraLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    const store = useCamerasStore();
    const { cameraList } = storeToRefs(store)
    const { refresh } = store

    refresh()

    return {
      cameraLinks: cameraList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      toggleCamera(deviceId) {
        store.toggleCamera(deviceId)
      },
      updateName(camera) {
        store.updateName(camera[0], camera[1])
      }
    };
  },
});
</script>
