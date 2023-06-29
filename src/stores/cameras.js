import { defineStore } from 'pinia';
import DetectRTC from 'detectrtc';

export const useCamerasStore = defineStore('cameras', {
  /**
   * Returns an object representing the initial state of the cameras array.
   *
   * @return {object} An object with an empty cameras array.
   */
  state: () => ({
    cameras: [],
  }),
  persist: true,
  getters: {
    cameraList: (state) => state.cameras
  },
  actions: {
    refresh() {
      // const devices = navigator.mediaDevices.enumerateDevices()
      DetectRTC.load(() => {
        this.cameras = DetectRTC.videoInputDevices.map((device) => {
          return { ...device, enabled: true };
        });
      })
    },
    toggleCamera(camera) {
      this.cameras.forEach((c) => {
        if (c.deviceId === camera) {
          c.enabled = !c.enabled;
        }
      });
      this.updateStore();
    },
    updateName(camera, name) {
      this.cameras.forEach((c) => {
        if (c.deviceId === camera) {
          c.name = name;
        }
      });
      this.updateStore();
    },
    updateStore() {
      // save cameras to local storage
      console.log('saving cameras to local storage');
    }
  },
});
