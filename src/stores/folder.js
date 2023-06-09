import { defineStore } from 'pinia';

export const useFolderStore = defineStore('folder', {
  state: () => ({
    folder: ''
  }),
  persist: true,
  // getters: {
  //   doubleCount (state) {
  //     return state.counter * 2
  //   }
  // },

  actions: {
    updateFolder (folderPath) {
      this.folder = folderPath
    }
  }
})
