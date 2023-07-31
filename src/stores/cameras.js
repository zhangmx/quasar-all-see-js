import { defineStore } from 'pinia';
import DetectRTC from 'detectrtc';

export const useCamerasStore = defineStore('cameras', {
  /**
   * Returns an object representing the initial state of the cameras array.
   *
   * @return {object} An object with an empty cameras array.
   */
  state: () => ({
    useMax: true,
    cameras: [],
  }),
  persist: true,
  // persist: {
  //   storage: localStorage, // 指定存储方式
  //   paths: ['cameras'] // 指定要保存的路径
  // },
  getters: {
    useMaxAble: (state) => state.useMax,
    cameraList: (state) => state.cameras
  },
  actions: {
    refresh() {
      // const devices = navigator.mediaDevices.enumerateDevices()
      DetectRTC.load(() => {
        const oldCameras = this.cameras;
        this.cameras = [];
        DetectRTC.videoInputDevices.map((device) => {
          // console.log(device);
          // 获取指定设备的capabilities
          if (this.useMax) {
            navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } })
              .then(stream => {
                const track = stream.getVideoTracks()[0];
                const capabilities = track.getCapabilities();

                // console.log(capabilities);
                // 获取支持的分辨率范围
                device.maxHeight = capabilities.height.max;
                device.maxWidth = capabilities.width.max;

                const oldCamera = oldCameras.find((c) => c.deviceId === device.deviceId);
                if (oldCamera) {
                  device.enabled = oldCamera.enabled;
                  device.name = oldCamera.name;
                  this.cameras.push(device);
                } else {
                  this.cameras.push({ ...device, enabled: true });
                }
                console.log(this.cameras);
              });
          } else {
            // 640 * 360
            // 640 * 480
            // 1280 * 720

            device.maxHeight = 960 / 2;
            device.maxWidth = 1280 / 2;
            const oldCamera = oldCameras.find((c) => c.deviceId === device.deviceId);

            if (oldCamera) {
              device.enabled = oldCamera.enabled;
              device.name = oldCamera.name;
              this.cameras.push(device);
            } else {
              this.cameras.push({ ...device, enabled: true });
            }
          }
          console.log(this.cameras);
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
    },
    updateName(camera, name) {
      this.cameras.forEach((c) => {
        if (c.deviceId === camera) {
          c.name = name;
        }
      });
    },
    toggleMax() {
      this.useMax = !this.useMax;
      this.refresh();
    }
  },
});
