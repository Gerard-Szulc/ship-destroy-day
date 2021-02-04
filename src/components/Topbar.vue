<template>
<div id="topbar">
  <div class="hamburger" @click="handleMenuOpen">
    <div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Topbar',
  methods: {
    handleMenuOpen () {
      this.$emit('menuOpen')
    },
    closeMenu () {
      this.$emit('closeMenu')
    }
  }
}
</script>

<style scoped>
.hamburger {
  cursor: pointer;
  padding: 5px;
  height: 2rem;
  width: 2rem;
}

.hamburger > div > div {
  border-radius: 2px;
  height: 5px;
  background-color: rgba(7, 113, 221, 0.8);
  margin: 5px 0;
  transition: 0.3s;
}
#topbar {
  z-index: 90;
  box-shadow: 5px 30px 40px -14px #E0E0E0;
  background-color: white;
  position: sticky;
  top: 0px;
  left: 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 2px;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
}
</style>
