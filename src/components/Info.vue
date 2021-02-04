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
@media screen and (max-width: 874px) {

  #info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
  }
  #info .info-field-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-items: center;
  }
}
.info-field-container {
  width: 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
}
.board-field {
  min-width: 32px;
  height: 2rem;
  width: 2rem;
  cursor: default;
  border: 1px solid black;
}
</style>
