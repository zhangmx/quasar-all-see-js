<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ $t('app') }}
        </q-toolbar-title>

        <q-space />

        <q-toggle v-model="useMaxAble" :label="$t('showMaxVideo')" dense borderless @update:model-value="onShowMaxVideo"/>

        <q-space />

        <q-select v-model="locale" :options="localeOptions"
          :label="$t('language')"
          dense borderless emit-value
          map-options options-dense
          style="min-width: 90px" />

        <div style="width: 60px;text-align: right;">v {{ appVersion }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
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

<style>
.q-field--auto-height.q-field--dense.q-field--labeled .q-field__native span,
.q-select__dropdown-icon,
.q-field--dense.q-field--float .q-field__label {
  color: white;
}
</style>

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
    const { useMaxAble, cameraList } = storeToRefs(store);
    const { refresh, toggleMax } = store;

    onMounted(async () => {
      appVersion.value = await getVersion();

      refresh();
    })

    return {
      cameraLinks: cameraList,
      leftDrawerOpen,
      useMaxAble,
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
      },
      onShowMaxVideo(e) {
        toggleMax();
        // window.location.reload();
      },
    };
  },
});
</script>
