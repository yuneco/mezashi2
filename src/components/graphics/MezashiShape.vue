<template>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="13" viewBox="-2 -2 24 13">
  <path d="M13.91,0c-.84,0-1.72.06-2.64.15C7.62.51,4.52,1.85,3.21,3.2a.46.46,0,0,1-.33.15.4.4,0,0,1-.3-.14L.67,1.33a.35.35,0,0,0-.23-.11c-.23,0-.44.3-.44.72L.3,4.5,0,7.06c0,.42.21.72.44.72a.35.35,0,0,0,.23-.11L2.6,5.77a.36.36,0,0,1,.27-.13.4.4,0,0,1,.3.15c1.27,1.35,4.32,2.7,8.1,3.07.91.09,1.79.14,2.62.14C17.43,9,20,6.82,20,4.5S17.44,0,13.91,0Z"
    :fill="hasFill ? color : 'none'"
    :stroke="color"
    :stroke-width="strokeWidth"
  />
</svg>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
export default createComponent({
  props: {
    color: { type: String, default: '#316285' },
    hasFill: { type: Boolean, default: true },
    strokeWidth: { type: Number, default: 2 }
  },
  setup () {
    return {}
  }
})
</script>
