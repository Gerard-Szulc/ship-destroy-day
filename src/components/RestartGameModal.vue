<template>
  <div class="modal">
    <div class="modal-card">
      <h3>Game Over</h3>
      <h4>Do you want to restart the game?</h4>
      <button @click="restartGame">Yes</button>
      <button @click="() => $emit('close')">No</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RestartGameModal',
  methods: {
    restartGame (e) {
      e.preventDefault()
      this.$emit('confirm')
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
</style>
