<template>
  <q-item>
    <q-item-section v-if="editing">
      <input type="text" v-model="cameraNewName" @change="$emit('updateName', [deviceId, cameraNewName]);editing = !editing">
    </q-item-section>

    <q-item-section v-if="!editing">
      <q-item-label clickable tag="a" target="javascript:void(0);" @click="$emit('toggleEnabled', deviceId)">{{ cameraName
      }}</q-item-label>
    </q-item-section>

    <q-item-section clickable tag="a" target="javascript:void(0);" @click="editing = !editing" avatar>
      <q-icon name="settings" />
    </q-item-section>
    <q-item-section v-if="enabled" avatar>
      <q-icon name="favorite" />
    </q-item-section>
  </q-item>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'CameraLink',
  props: {
    deviceId: {
      type: String,
      required: true,
    },

    groupId: {
      type: String,
      default: '',
    },

    id: {
      type: String,
      default: '',
    },

    isCustomLabel: {
      type: Boolean,
      default: false,
    },

    enabled: {
      type: Boolean,
      default: false,
    },

    kind: {
      type: String,
      default: '#',
    },

    label: {
      type: String,
      default: '',
    },

    name: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const cameraName = computed(() => {
      return props.name || props.label;
    });

    const editing = ref(false)
    const cameraNewName = ref('')

    onMounted(() => {
      cameraNewName.value = props.name
    })

    return {
      editing,
      cameraNewName,
      cameraName
    }
  }
});
</script>
