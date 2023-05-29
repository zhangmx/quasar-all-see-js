<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const stream = ref(null)
const constraints = {
  audio: false,
  video: {
    width: { min: 1024, ideal: 1280, max: 1920 },
    height: { min: 576, ideal: 720, max: 1080 },
    facingMode: 'environment',
  },
}

onMounted(async () => {
  stream.value = await navigator.mediaDevices.getUserMedia(constraints)
})

onBeforeUnmount(() => {
  stream.value.getTracks().forEach(track => track.stop())
})
</script>

<template>
  <video :srcObject="stream" width="300" height="200" autoplay></video>
</template>
