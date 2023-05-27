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
  getters: {
    cameraList: (state) => state.cameras,
  },
  actions: {
    refresh() {
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
    }
  },
});
