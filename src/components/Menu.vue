<template>
  <div>
    <nav id="nav" :class="{'opened': menuOpened}" @blur="closeMenu">
      <ul v-if="menuOpened" id="menu-list">
        <router-link to="/">
          <li @click="closeMenu">
            Game
          </li>
        </router-link>

        <router-link to="/stats">
          <li @click="closeMenu">Stats</li>
        </router-link>

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
  color: #2c3e50;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: rgba(7, 113, 221, 0.8);
}

#nav.opened {
  width: 8rem;
}

.fake-background {
  z-index: 99;
  transition: all 0.3s;
  visibility: hidden;
  width: 100vw;
  left: 0;
}

.fake-background.opened {
  visibility: visible;
  background-color: rgba(7, 7, 7, 0.1);
  top: 0;
  left: 8rem;
  width: calc(100vw - 8rem);
  height: 100vh;
  position: absolute;
}

#menu-list {
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
}

#menu-list li {
  margin: 2px;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
}

#menu-list li:hover {
  background-color: #ececec;
}

#menu-list li:active {
  background-color: #dbdbdb;
}
</style>
