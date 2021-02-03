<template>
  <div id="info">
    <div class="info-field-container">
      <div class="board-field field-empty"></div><p>Miss</p>
    </div>
    <div class="info-field-container">
      <div class="board-field field-hit"></div><p>Hit</p>
    </div>
    <div class="info-field-container">
      <div class="board-field field-hit field-destroyed"></div><p>Destroyed</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Info'
}
</script>

<style scoped>
#info {
  padding: 2rem;
  display: flex;
  justify-content: center;
  flex-direction: row;
}
.info-field-container {
  width: 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
}
.board-field {
  height: 2rem;
  width: 2rem;
  cursor: default;
  border: 1px solid black;
}
</style>
