<template>
  <div>
    <Modal v-show="gameWonModalVisible" :moves="moves" @close="handleCloseScoreModal"></Modal>
    <RestartGameModal v-show="restartGameModalVisible" @confirm="handleNewGame"
                      @close="() => restartGameModalVisible = false"></RestartGameModal>
    <ModeSelectionModal v-show="modeSelectionModalVisible" @load="handleLoadSavedState" @limit="handleStartLimitModeGame"
                        @close="handleStartNormalModeGame"></ModeSelectionModal>
    <section class="board-container" v-if="loaded">
      <div class="board">
        <div v-for="(row, key) in rows" :key="`row-${key}`" class="board-row">
          <template v-for="(field, fieldIndex) in row">
            <div :key="`field-${key}-${fieldIndex}`"
                 class="board-field"
                 @click="() => handleFire(field)"
                 :class="{
                   'field-hit': field.revealed && field.occupied,
                    'field-empty': !field.occupied && field.revealed,
                     'field-destroyed': field.destroyed
                 }"
                 :field="field"
            >
            </div>
          </template>
        </div>

      </div>
    </section>
    <Info
      v-if="loaded"/>
    <button
      v-if="loaded"
      @click="restartNewGame"
    >Restart
    </button>
  </div>
</template>

<script>
import gameEngine from '@/mixins/gameEngine.js'
import Info from '@/components/Info.vue'
import localStorageClient from '@/utils/localStorageClient.js'
import Modal from '@/components/ScoreModal.vue'
import RestartGameModal from '@/components/RestartGameModal.vue'
import ModeSelectionModal from '@/components/ModeSelectionModal.vue'

const MODE_DEFAULT = 'default'
// const MODE_LIMITED_MOVES = 'limited'
const SIZE_X = 10
const SIZE_Y = 10
export default {
  name: 'Game',
  components: {
    ModeSelectionModal,
    RestartGameModal,
    Modal,
    Info
  },
  mixins: [gameEngine],
  props: {
    sizeX: {
      type: Number,
      default: () => SIZE_X
    },
    sizeY: {
      type: Number,
      default: () => SIZE_Y
    }
  },
  data () {
    return {
      hitslist: {},
      battleships: null,
      mode: MODE_DEFAULT,
      maxMovesOption: null,
      loaded: false,
      moves: 0,
      rows: null,
      gameWonModalVisible: false,
      restartGameModalVisible: false,
      modeSelectionModalVisible: true
    }
  },

  computed: {
    maxMoves () {
      if (this.maxMovesOption) {
        return this.maxMovesOption
      }
      return this.sizeX * this.sizeY
    }
  },
  mounted () {
    this.getBattleShips()
  },
  methods: {
    handleStartLimitModeGame (payload) {
      this.hitslist = {}
      this.moves = 0
      this.maxMovesOption = payload
      this.getBoard(true)
      this.m$initWorker(true)
      this.modeSelectionModalVisible = false
    },
    handleStartNormalModeGame () {
      this.maxMovesOption = null
      this.hitslist = {}
      this.moves = 0
      this.getBoard(true)
      this.m$initWorker(true)
      this.modeSelectionModalVisible = false
    },
    handleLoadSavedState () {
      this.maxMovesOption = null
      this.hitslist = {}
      this.moves = 0
      this.getBoard(false)
      this.m$initWorker(false)
      this.modeSelectionModalVisible = false
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
    getBoard (clean) {
      if (!clean) {
        const lsData = localStorageClient.retrieveItem('board')
        if (!lsData) {
          clean = true
        } else {
          const {
            board,
            moves,
            hitlist,
            maxMoves

          } = lsData
          this.rows = board
          this.moves = moves
          this.hitslist = hitlist
          this.maxMovesOption = maxMoves
          return
        }

        clean = true
      }

      const defaultField = {
        id: null,
        shipArea: false,
        occupied: false,
        revealed: false
      }
      this.rows = Array(this.sizeY).fill('temp').map((row, rowIndex) => {
        return Array(this.sizeX).fill(defaultField).map((el, index) => ({
          ...el,
          rowIndex,
          colIndex: index
        }))
      }, [])
    },
    checkDestroyedShips () {
      return Object.entries(this.hitslist)
        .filter(([key, value]) => Object.values(value)
          .every(item => parseInt(item) === parseInt(key)))
        .map(([key, value]) => Object.values(value))
        .flat().length === 10
    },
    handleFire (field) {
      if (this.moves >= this.maxMoves) {
        this.restartGameModalVisible = true
        return
      }
      if (field.revealed) {
        return
      }
      if (this.checkDestroyedShips()) {
        this.restartGameModalVisible = true
        return
      }
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
          this.rows.flat().forEach(scannedField => {
            if (scannedField.id === field.id) {
              scannedField.destroyed = true
            }
          })
        }
      }

      field.revealed = true
      this.moves++

      localStorageClient.saveItem('board', {
        board: this.rows,
        moves: this.moves,
        hitlist: this.hitslist,
        maxMoves: this.maxMoves
      })
      if (this.checkDestroyedShips()) {
        this.gameWonModalVisible = true
      }
    },
    handleNewGame (e) {
      if (e) {
        e.preventDefault()
      }
      this.modeSelectionModalVisible = true
    },
    restartNewGame (e) {
      if (e) {
        e.preventDefault()
      }
      this.m$restartGame(true)
      this.modeSelectionModalVisible = true
    },
    handleCloseScoreModal () {
      this.gameWonModalVisible = false
      this.restartGameModalVisible = true
    }
  }
}
</script>

<style>
.board-container {
  margin-top: 3rem;
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

.field-hit.board-field:hover, .field-empty.board-field:hover {
  cursor: not-allowed;
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
