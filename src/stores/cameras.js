import { defineStore } from 'pinia';
import DetectRTC from 'detectrtc';

export const useCamerasStore = defineStore('cameras', {
  state: () => ({
    cameras: [],
  }),
  getters: {
    cameraList: (state) => state.cameras,
  },
  actions: {
    refresh() {
      DetectRTC.load(() => {
        this.cameras = DetectRTC.videoInputDevices;
      })
    },
    toggleCamera(camera) {
      this.cameras.forEach((c) => {
        if (c.deviceId === camera) {
          c.enabled = !c.enabled;
        }
      });
    }
  },
});
