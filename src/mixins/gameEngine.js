import localStorageClient from '@/utils/localStorageClient.js'

export default {
  data () {
    return {
      worker: null,
      hitslist: {},
      battleships: null,
      loaded: false,
      moves: 0,
      rows: null
    }
  },
  beforeDestroy () {
    if (this.worker) {
      this.destroyWorker()
    }
  },
  methods: {
    destroyWorker () {
      this.worker.terminate()
    },
    async m$initWorker (clean) {
      const data = await fetch(document.querySelector('#worker-script').src)
      const scriptBlob = new Blob(
        [await data.text()],
        { type: 'text/javascript' }
      )
      this.worker = new Worker(window.URL.createObjectURL(scriptBlob))
      this.worker.onmessage = (message) => {
        this.rows = message.data.rows
        this.loaded = true
      }
      if (!clean) {
        this.loaded = true
        return
      }
      this.worker.postMessage({
        rows: this.rows,
        battleships: this.battleships,
        maxSizeX: this.sizeX,
        maxSizeY: this.sizeY
      })
    },
    m$restartGame (clean) {
      if (clean) {
        this.hitslist = {}
        this.moves = 0
        this.getBoard(clean)
        this.worker.postMessage({
          rows: this.rows,
          battleships: this.battleships,
          maxSizeX: this.sizeX,
          maxSizeY: this.sizeY
        })
      }
      this.getBoard(clean)
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
    getBoard (clean) {
      if (!clean) {
        const lsData = localStorageClient.loadState()
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

      localStorageClient.saveState({
        board: this.rows,
        moves: this.moves,
        hitlist: this.hitslist,
        maxMoves: this.maxMoves
      })
      if (this.checkDestroyedShips()) {
        this.gameWonModalVisible = true
      }
    }
  }
}
