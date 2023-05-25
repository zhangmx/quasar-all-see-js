<template>
  <q-page class="flex flex-center">

    <CameraVideo v-for="camera in cameraList" :key="camera.title" v-bind="camera" />

    <span class="tag label bg-primary text-white">Current folder: {{ fileFolder }}</span><br />
    <hr />
    <q-btn @click="updateFileFolder" color="secondary" label="Update folder" />

    <!-- <input type="file" webkitdirectory="true" directory @change="updateFileFolder" /> -->

  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { useCamerasStore } from 'stores/cameras';
import { useFolderStore } from 'stores/folder';
import { storeToRefs } from 'pinia';
import CameraVideo from 'components/CameraVideo.vue';

import { selectFolder } from '../backend/utils.js'

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

    console.log(folder)
    async function updateSavedFolder(event) {
      console.log(event.target)

      const folder = await selectFolder()
      console.log(folder)
      if (folder && folder.length > 0) {
        updateFolder(folder[0]);
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
