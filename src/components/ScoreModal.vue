<template>
  <div class="modal">
    <div class="modal-card">
      <h3>Your score is {{moves}}</h3>
      <form @submit.prevent="handleSaveScore">
        <label for="hiscore-name">Enter your name:</label>
        <input id="hiscore-name" type="text" v-model="name">
      </form>
      <div class="button-container">
        <button @click="handleSaveScore" class="primary">Save</button>
        <button @click="() => $emit('close')" class="danger">Cancel</button>
      </div>
    </div>

  </div>
</template>

<script>
import localStorageClient from '@/utils/localStorageClient.js'

export default {
  name: 'Modal',
  data () {
    return {
      name: ''
    }
  },
  props: {
    moves: {
      type: Number
    }
  },
  methods: {
    handleSaveScore (e) {
      e.preventDefault()
      localStorageClient.saveHighscore({
        moves: this.moves,
        name: this.name,
        date: new Date()
      })
      this.$emit('close')
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
  width: 20rem;
  height: 15rem;
}
.modal-card form {
  display: flex;
  flex-direction: column;
}
#hiscore-name {
  height: 2rem;
  width: calc(10rem - 2px);
  border-radius: 2px;
  border: 1px solid rgba(1, 1, 1, 0.3 );
}
</style>
