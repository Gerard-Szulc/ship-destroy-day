<template>
  <div>
    <section class="board-container">
      <div v-if="loaded" class="board">
        <div v-for="(row, key) in rows" :key="`row-${key}`" class="board-row">
          <template v-for="(field, fieldIndex) in row">
            <div :key="`field-${key}-${fieldIndex}`"
                 class="board-field"
                 @click="() => handleFire(field)"
                 :class="{'field-hit': field.revealed && field.occupied, 'field-empty': !field.occupied && field.revealed, 'field-destroyed': field.destroyed}"
                 :field="field"
            >
            </div>
          </template>
        </div>

      </div>
      <section v-else><span>Loading</span></section>
    </section>
    <Info/>
    <button @click="handleNewGame">Nowa gra</button>
  </div>
</template>

<script>
import gameEngine from '@/mixins/gameEngine.js'
import Info from '@/components/Info.vue'

const MODE_DEFAULT = 'default'
// const MODE_LIMITED_MOVES = 'limited'
const SIZE_X = 10
const SIZE_Y = 10
export default {
  name: 'Game',
  components: { Info },
  mixins: [gameEngine],
  props: {
    sizeX: {
      type: Number,
      default: () => SIZE_X
    },
    sizeY: {
      type: Number,
      default: () => SIZE_Y
    },
    maxMovesProp: {
      type: Number
    }
  },
  data () {
    return {
      hitslist: {},
      battleships: null,
      mode: MODE_DEFAULT,
      loaded: false,
      moves: 0,
      rows: null
    }
  },
  beforeDestroy () {
    this.destroyWorker()
  },
  computed: {
    maxMoves () {
      if (this.maxMovesProp) {
        return this.maxMovesProp
      }
      return this.sizeX * this.sizeY
    }
  },
  mounted () {
    this.getBattleShips()
    this.getBoard()
    this.m$initWorker()
  },
  methods: {
    destroyWorker () {
      this.worker.terminate()
    },
    getBattleShips () {
      this.battleships = [
        [Array(4)],
        [Array(3), Array(3)],
        [Array(2), Array(2), Array(2)],
        [Array(1), Array(1), Array(1), Array(1)]
      ].flat(1).map((el, index) => el.fill({
        size: el.length,
        id: index
      }))
    },
    prepareField ({
      field,
      rowIndex,
      fieldIndex
    }) {
      return {
        ...field,
        rowIndex,
        fieldIndex
      }
    },
    getBoard () {
      const defaultField = {
        id: null,
        shipArea: false,
        occupied: false,
        revealed: false
      }
      this.rows = Array(this.sizeY).fill('temp').map((row, rowIndex) => {
        // console.log(acc, nextRow)
        return Array(this.sizeX).fill(defaultField).map((el, index) => ({
          ...el,
          rowIndex,
          colIndex: index
        }))
      }, [])
    },
    handleFire (field) {
      console.log(field)
      if (this.moves >= this.maxMoves) {
        console.log('Game over')
        return
      }
      if (field.revealed) {
        return
      }
      console.log(field, field.id, field.size)
      if (field.occupied) {
        let subList = {}

        if (!this.hitslist[field.size]) {
          subList[field.id] = 1
        } else {
          subList = this.hitslist[field.size]
          subList[field.id] = (this.hitslist[field.size][field.id] || 0) + 1
        }
        this.$set(this.hitslist, field.size, subList)

        if (this.hitslist[field.size][field.id] === field.size) {
          // console.log('all', this.rows.flat())
          this.rows.flat().forEach(scannedField => {
            if (scannedField.id === field.id) {
              console.log('all', field.id, scannedField.id)
              scannedField.destroyed = true
            }
          })
        }

        console.log('hit')
      }

      field.revealed = true
      this.moves++
    },
    handleNewGame (e) {
      e.preventDefault()
      this.m$restartGame()
    }
  }
}
</script>

<style>
.board-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.board {
  padding: 20px;
  border-radius: 5px;
  box-shadow: 5px 5px 35px -5px rgba(0, 0, 0, 0.5);
}

.board-row {
  display: flex;
  flex-direction: row;
}

.board-row:first-child {
  border-top: solid 1px black;
}

@media screen and (max-width: 874px) {

  .board .board-field {
    width: 1.5rem;
    height: 1.5rem;
  }

}
.board-field {
  width: 3rem;
  height: 3rem;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
}

.board-field:last-child {
  border-right: 1px solid black;
}

.board-field:hover {
  transition: box-shadow ease 0.2s;
  /*transform: translate(10px, 10px);*/
  cursor: pointer;
  box-shadow: inset -1px -1px 49px -40px rgba(0, 0, 0, 0.95);
}

.board-field:active {
  transition: box-shadow ease 0.2s;
  box-shadow: inset -1px -1px 49px -30px rgba(0, 0, 0, 0.95);

}

.field-empty {
  background-color: #7fa1fa;
}

.field-hit {
  background-color: #fc6e6e;
}

.field-hit.field-destroyed {
  background-color: #ff0000;
}
.hit-list {
  /*height: 100px;*/
  /*align-self: flex-end;*/
  /*justify-self: flex-end;*/
}
</style>
