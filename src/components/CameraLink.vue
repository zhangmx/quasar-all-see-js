<template>
  <q-item
    clickable
    tag="a"
    target="javascript:void(0);"
    @click="$emit('toggleEnabled',deviceId)"
  >
    <q-item-section>
      <q-item-label>{{ cameraName }}</q-item-label>
    </q-item-section>

    <q-item-section
      v-if="enabled"
      avatar
    >
      <q-icon name="favorite" />
    </q-item-section>
  </q-item>
</template>

<script>
import { computed, defineComponent } from 'vue';

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

    return {
      cameraName
    }
  }
});
</script>
