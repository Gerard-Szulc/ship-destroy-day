<template>
  <div>
    <nav id="nav" :class="{'opened': menuOpened}" @blur="closeMenu">
      <ul v-if="menuOpened" class="menu-list">
        <li @click="closeMenu">
          <router-link to="/game" >Game</router-link>
        </li>
        <li @click="closeMenu">
          <router-link to="/stats" >Stats</router-link>
        </li>
      </ul>

    </nav>
    <div class="fake-background" :class="{'opened': menuOpened}" @click="closeMenu"></div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    menuOpened: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    closeMenu () {
      this.$emit('closeMenu')
    }
  }
}
</script>

<style scoped>
#nav {
  z-index: 100;
  box-shadow: 5px 5px 35px -5px rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 0;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  transition: all 0.2s;
  background-color: white;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#nav.opened {
  width: 8rem;
}

.fake-background {
  transition: all 0.3s;
  visibility: hidden;
  width: 100vw;
  left: 0;
}

.fake-background.opened {
  visibility: visible;
  /*display: block;*/
  background-color: rgba(7, 7, 7, 0.1);
  top: 0;
  left: 8rem;
  width: calc(100vw - 8rem);
  height: 100vh;
  position: absolute;
}
.menu-list {
  list-style: none;
}
</style>
