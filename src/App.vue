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
button {
  margin: 2px;
  transition: all 0.2s;
  width: 5rem;
  height: 2rem;
  background-color: white;
  border: 1px solid rgba(1,2,3, 0.5);
  /*box-shadow: 2px 3px 5px 5px rgba(1,2,3, 0.1);*/
  border-radius: 2px;
  cursor: pointer;
}
button:hover {
  background-color: #ececec;
}
button.primary {
  color: rgba(7, 113, 221, 0.8);
  border: 1px solid rgba(7, 113, 221, 0.8);
}
button.danger {
  color: rgb(221, 7, 7);
  border: 1px solid rgb(221, 7, 57);
}
</style>
