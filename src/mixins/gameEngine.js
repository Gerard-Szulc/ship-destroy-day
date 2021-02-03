export default {
  data () {
    return {
      worker: null
    }
  },
  methods: {
    async m$initWorker () {
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

      this.worker.postMessage({
        rows: this.rows,
        battleships: this.battleships,
        maxSizeX: this.sizeX,
        maxSizeY: this.sizeY
      })
    },
    m$restartGame () {
      this.moves = 0
      this.getBoard()
      this.worker.postMessage({
        rows: this.rows,
        battleships: this.battleships,
        maxSizeX: this.sizeX,
        maxSizeY: this.sizeY
      })
    }
  }
}
