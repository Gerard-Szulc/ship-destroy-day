// import localStorageClient from '@/utils/localStorageClient.js'

export default {
  data () {
    return {
      worker: null
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
        // localStorageClient.saveItem('board', {
        //   board: this.rows,
        //   moves: this.moves,
        //   hitlist: this.hitslist,
        //   maxMoves: this.maxMoves
        // })
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
    }
  }
}
