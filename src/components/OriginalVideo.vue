<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const stream = ref(null)
const mediaRecorder = ref(null)
const videoRecorded = ref(null)

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

  mediaRecorder.value = new MediaRecorder(stream.value, { // <3>
    mimeType: 'video/webm',
  }).addEventListener('dataavailable', event => {
    videoRecorded.value = URL.createObjectURL(event.data) // <6>
  })
})

onBeforeUnmount(() => {
  stream.value.getTracks().forEach(track => track.stop())
})

const startRecording = () => {
  mediaRecorder.value.start()
}

const stopRecording = () => {
  mediaRecorder.value.stop()
}
</script>

<template>
  <q-card class="my-card">
    <q-card-section class="bg-primary text-white">
      <video :srcObject="stream" width="300" height="200" autoplay muted playsinline></video>
      <video :src="videoRecorded" controls playsinline></video>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn flat @click="startRecording">Start</q-btn>
      <q-btn flat @click="stopRecording">Stop</q-btn>
    </q-card-actions>
  </q-card>
</template>
