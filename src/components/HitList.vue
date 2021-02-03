<template>
 <ul>
   <template v-for="ship in ships">
     <li v-if="ship" :key="ship.id" class="hit-list-ship">
       <template v-for="(field, index) in ship">
         <div :key="`hit-list-ship-${index}`" class="board-field field-hit" :class="{'field-destroyed': hittedShips[field.size] && hittedShips[field.size][field.id] === field.size}">
         </div>
       </template>
     </li>
   </template>
 </ul>
</template>

<script>
export default {
  name: 'HitList',
  props: {
    ships: {
      type: Array,
      default: () => []
    },
    hittedShips: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>
.hit-list-ship {
  display: flex;
  flex-direction: row;
  padding: 5px;
}
.board-field {
  width: 20px;
  height: 20px;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
}
.field-hit {
  background-color: #f69e9e;
}

.field-hit.field-destroyed {
  background-color: #ff0000;
}
</style>
