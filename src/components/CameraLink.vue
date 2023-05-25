<template>
  <q-item
    clickable
    tag="a"
    target="javascript:void(0);"
    @click="$emit('toggleEnabled',deviceId)"
  >
    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
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
import { defineComponent } from 'vue';

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

  },

  methods: {
    toggleEnabled() {
      console.log('Toggle enabled', this.enabled);
      this.$emit('update:enabled', !this.enabled);
    },
  },
});
</script>
