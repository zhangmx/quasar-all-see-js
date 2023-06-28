<template>
  <q-card class="my-card">
    <q-card-section class="bg-primary text-white">
      <video ref="videoRef" :id="videoElementId" :srcObject="stream"  width="300" height="200" autoplay muted playsinline></video>
      <video :src="videoRecorded" controls playsinline></video>
    </q-card-section>

    <q-separator />
    <q-card-section>
      {{ lastSavedFilePath }}
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat @click="startRecording">Start</q-btn>
      <q-btn flat @click="stopRecording">Stop</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps, computed } from 'vue'

const stream = ref(null)
const mediaRecorder = ref(null)
const videoRecorded = ref(null)

const videoRef = ref(0)
defineExpose({
  videoRef
})
const lastSavedFilePath = ref('')

const props = defineProps({
  id: { type: String },
  deviceId: { type: String },
  name: { type: String },
  label: { type: String },
})

console.log(props)

const videoElementId = computed(() => 'id' + props.id.slice(2, 10))

const constraints = {
  audio: false,
  video: {
    width: { min: 1024, ideal: 1280, max: 1920 },
    height: { min: 576, ideal: 720, max: 1080 },
    // facingMode: 'environment',
    deviceId: props.deviceId
  },
}

onMounted(async () => {
  console.log(constraints)
  stream.value = await navigator.mediaDevices.getUserMedia(constraints)
  console.log(stream.value)

  const mr = new MediaRecorder(stream.value, { // <3>
    mimeType: 'video/webm',
  })
  mr.addEventListener('dataavailable', event => {
    videoRecorded.value = URL.createObjectURL(event.data) // <6>
  })
  mediaRecorder.value = mr
  // console.log(mediaRecorder.value)

  console.log(videoRef.value)
  // videoRef.value.srcObject = stream.value
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
