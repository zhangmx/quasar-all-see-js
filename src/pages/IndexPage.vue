<template>
  <q-page class="flex flex-center" style="width:100%">
    <div class="q-pa-md row items-start q-gutter-md" style="width:100%">
      <CameraVideo style="width:45%" v-for="camera in cameraList" :key="camera.deviceId" v-bind="camera" :saved-folder="fileFolder" />
    </div>
  </q-page>

  <q-footer reveal bordered class="bg-grey-8 text-white">
    <q-toolbar>
      <q-toolbar-title>
        <q-btn @click="updateFileFolder" color="secondary" :label="$t('video_save_path')" />
        <span class="tag label bg-primary text-white">{{ fileFolder }}</span>
      </q-toolbar-title>
    </q-toolbar>
  </q-footer>
</template>

<script>
import { defineComponent, onBeforeMount } from 'vue';
import { useCamerasStore } from 'stores/cameras';
import { useFolderStore } from 'stores/folder';
import { storeToRefs } from 'pinia';
import CameraVideo from 'components/CameraVideo.vue';
import { selectFolder, shortcutDirs } from '../backend/utils.js'

export default defineComponent({
  name: 'IndexPage',

  components: {
    CameraVideo,
  },

  setup() {
    const camerasStore = useCamerasStore();
    const { cameraList } = storeToRefs(camerasStore);
    const folderStore = useFolderStore();
    const { folder } = storeToRefs(folderStore);
    const { updateFolder } = folderStore;

    onBeforeMount(async () => {
      if (!folder.value) {
        const shortcuts = await shortcutDirs()
        updateFolder(shortcuts.video);
      }
    })

    async function updateSavedFolder(event) {
      const userSelectFolder = await selectFolder()

      if (userSelectFolder && userSelectFolder.length > 0) {
        updateFolder(userSelectFolder[0]);
      }
    }

    return {
      cameraList,
      fileFolder: folder,
      updateFileFolder: updateSavedFolder,
    }
  }
});
</script>
