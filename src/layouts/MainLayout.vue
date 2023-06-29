<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ $t('app') }}
        </q-toolbar-title>

        <q-select v-model="locale" :options="localeOptions"
          :label="$t('language')"
          dense borderless emit-value
          map-options options-dense
          style="min-width: 150px" />

        <div>v {{ appVersion }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          {{ $t('all_cameras') }}
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
import { defineComponent, onMounted, ref } from 'vue';
import CameraLink from 'components/CameraLink.vue';
import { useCamerasStore } from 'stores/cameras';
import { storeToRefs } from 'pinia';
import { getVersion } from '../backend/utils.js';
import * as i18n from 'vue-i18n';

export default defineComponent({
  name: 'MainLayout',

  components: {
    CameraLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const appVersion = ref('');

    const { locale } = i18n.useI18n({ useScope: 'global' });

    const localeOptions = [
      { label: 'English', value: 'en-US' },
      { label: '简体中文', value: 'zh-CN' },
    ]

    const store = useCamerasStore();
    const { cameraList } = storeToRefs(store);
    const { refresh } = store;

    onMounted(async () => {
      appVersion.value = await getVersion();

      refresh();
    })

    return {
      cameraLinks: cameraList,
      leftDrawerOpen,
      appVersion,
      locale,
      localeOptions,
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
