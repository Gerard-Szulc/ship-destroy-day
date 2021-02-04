<template>
  <div>
    <Modal v-show="gameWonModalVisible" :moves="moves" @close="handleCloseScoreModalVisibility"></Modal>
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
      @click="(e) => handleNewGame(e, true)"
    >Restart
    </button>
  </div>
</template>

<script>
import gameEngine from '@/mixins/gameEngine.js'
import Info from '@/components/Info.vue'
import Modal from '@/components/ScoreModal.vue'
import RestartGameModal from '@/components/RestartGameModal.vue'
import ModeSelectionModal from '@/components/ModeSelectionModal.vue'

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
      maxMovesOption: null,
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
    handleNewGame (e, restart = false) {
      if (e) {
        e.preventDefault()
      }
      if (restart) {
        this.m$restartGame(true)
      }
      this.modeSelectionModalVisible = true
    },
    handleCloseScoreModalVisibility () {
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
  background-color: rgba(7, 113, 221, 0.8);
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
