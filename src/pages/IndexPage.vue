<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      <CameraVideo v-for="camera in cameraList" :key="camera.deviceId" v-bind="camera" :saved-folder="fileFolder" />
    </div>
  </q-page>

  <q-footer reveal bordered class="bg-grey-8 text-white">
    <q-toolbar>
      <q-toolbar-title>
        <q-btn @click="updateFileFolder" color="secondary" label="视频保存目录: " />
        <span class="tag label bg-primary text-white">{{ fileFolder }}</span>
      </q-toolbar-title>
    </q-toolbar>
  </q-footer>
</template>

<script>
import { defineComponent, onBeforeMount, onUpdated } from 'vue';
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
      console.log(cameraList.value)
    })

    onUpdated(async () => {
      console.log(cameraList.value)
    })
    console.log(cameraList.value)
    console.log(folder.value)

    async function updateSavedFolder(event) {
      console.log(event.target)

      const userSelectFolder = await selectFolder()
      console.log(userSelectFolder)
      if (userSelectFolder && userSelectFolder.length > 0) {
        updateFolder(userSelectFolder[0]);
      }
      // updateFolder(folder[0]);
      // const { ipcRenderer } = require('electron')
      // ipcRenderer.send('select-dir')
      // updateFolder(event.target.value);
      // const { dialog } = require('electron').remote
      // const path = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
      // console.log(path);
      // updateFolder(path);

      // const dirHandle = await window.showDirectoryPicker();
      // // const out = {};
      // // await handleDirectoryEntry(dirHandle, out);
      // console.log(dirHandle)
      // const dirPath = await dirHandle.resolve(dirHandle)

      // const dirName = 'directoryToGetName';
      // const subDir = dirHandle.getDirectoryHandle(dirName, { create: false });

      // console.log(subDir)

      // updateFolder(dirPath);
    }

    // async function handleDirectoryEntry(dirHandle, out) {
    //   for await (const entry of dirHandle.values()) {
    //     if (entry.kind === 'file') {
    //       const file = await entry.getFile();
    //       out[file.name] = file;
    //     }
    //     if (entry.kind === 'directory') {
    //       const newHandle = await dirHandle.getDirectoryHandle(entry.name, { create: false });
    //       const newOut = out[entry.name] = {};
    //       await handleDirectoryEntry(newHandle, newOut);
    //     }
    //   }
    // }
    // console.log($store)
    return {
      cameraList,
      fileFolder: folder,
      updateFileFolder: updateSavedFolder,
    }
  }
});
</script>
