<template>
  <div :class="cssClass"></div>
</template>

<script>
export default {
  name: 'Field',
  props: {
    field: { type: Object },
    cssClass: {}
  }
}
</script>

<style scoped>

</style>
