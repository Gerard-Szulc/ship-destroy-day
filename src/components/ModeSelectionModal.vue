<template>
  <div class="modal">
    <div class="modal-card">
      <h3>Set moves limit or start normal mode</h3>
      <form @submit.prevent="handleSaveMode">
        <label for="moves-limit">Set moves limit:</label>
        <input id="moves-limit" type="number" v-model="movesLimit">
      </form>
      <div class="button-container">
        <button @click="handleSaveMode" class="primary">Accept</button>
        <button @click="() => $emit('close')" class="primary">Normal Mode</button>
        <button @click="() => $emit('load')" class="primary">Load game</button>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'ModeSelectionModal',
  data () {
    return {
      movesLimit: 100
    }
  },
  props: {
    moves: {
      type: Number
    }
  },
  methods: {
    handleSaveMode (e) {
      if (e) {
        e.preventDefault()
      }
      this.$emit('limit', this.movesLimit)
    }
  }
}
</script>

<style scoped>
.modal {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 110;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.2);
}

.modal-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 5px 5px 35px -5px rgba(0, 0, 0, 0.5);
  position: relative;
  top: 20%;
  margin: auto auto;
  /* left: auto; */
  width: 20rem;
  height: 15rem;
}

.modal-card form {
  display: flex;
  flex-direction: column;
}

#moves-limit {
  height: 2rem;
  width: calc(10rem - 2px);
  border-radius: 2px;
  border: 1px solid rgba(1, 1, 1, 0.3);
}
.button-container {
  display: flex;
  flex-direction: row;
}
</style>
