<template>
  <div id="app">
    <Topbar @menuOpen="handleMenu"></Topbar>
    <Menu :menu-opened="menuOpened" @closeMenu="closeMenu"></Menu>
    <router-view />
  </div>
</template>
<script>
import Menu from '@/components/Menu.vue'
import Topbar from '@/components/Topbar.vue'
export default {
  name: 'App',
  components: { Topbar, Menu },
  data () {
    return {
      menuOpened: false
    }
  },
  methods: {
    handleMenu () {
      this.menuOpened = !this.menuOpened
    },
    closeMenu () {
      if (this.menuOpened) {
        this.menuOpened = false
      }
    }
  }
}
</script>
<style>
#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
