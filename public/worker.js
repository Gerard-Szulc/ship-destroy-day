const DIRECTION_VERTICAL = 'v'
const DIRECTION_HORIZONTAL = 'h'
let cache = {}

const getDirection = () => {
  return Math.random() > 0.5 ? DIRECTION_VERTICAL : DIRECTION_HORIZONTAL
}
const getStartRow = (maxSizeY) => {
  return Math.round(Math.random() * (maxSizeY - 1))
}
const getStartColumn = (maxSizeX) => {
  return Math.round(Math.random() * (maxSizeX - 1))
}
const getShipArea = ({board, ship, direction, startX, startY}) => board
  .filter((row, index) => {
    if (direction === DIRECTION_HORIZONTAL) {
      return index >= startY - 1 && index < (startY + 1)
    }
    if (direction === DIRECTION_VERTICAL) {
      return index >= startY - 1 && index < (startY + ship.length)
    }
  })
  .map(row => row
    .filter((field, colIndex) => {
      if (direction === DIRECTION_HORIZONTAL) {
        return colIndex >= startX - 1 && colIndex < (startX + ship.length)
      }
      if (direction === DIRECTION_VERTICAL) {
        return colIndex >= startX - 1 && colIndex < (startX + 1)
      }
    })
  )

const placeAvailable = ({board, ship, direction, startX, startY, maxSizeY, maxSizeX}) => {
  if (direction === DIRECTION_HORIZONTAL) {
    if (startX + ship.length > (maxSizeX - 1)) {
      return false
    }
  }
  if (direction === DIRECTION_VERTICAL) {
    if (startY + ship.length > (maxSizeY - 1)) {
      return false
    }
  }
  const area = getShipArea({board, ship, direction, startX, startY})
  return !area.flat().some(field => field.occupied || field.shipArea)
}

const placeShip = (board, ship, maxSizeY, maxSizeX) => {
  const direction = getDirection()
  const startX = getStartColumn(maxSizeX)
  const startY = getStartRow(maxSizeY)
  // console.log(`${direction}-${startX}-${startY}-${ship.length}`, cache[`${direction}-${startX}-${startY}-${ship.length}`])
  if (cache[`${direction}-${startX}-${startY}-${ship.length}`]) {
    return false
  }
  const canPlaceShip = placeAvailable({board, ship, direction, startX, startY, maxSizeY, maxSizeX})
  if (canPlaceShip) {
    if (direction === DIRECTION_HORIZONTAL) {
      for (let i = startX; i < startX + ship.length; i++) {
        board[startY][i].occupied = true
        board[startY][i].size = ship[0].size
        board[startY][i].id = ship[0].id
      }
      // console.log('bor', getShipArea(board, ship, direction, startX, startY))
    }
    if (direction === DIRECTION_VERTICAL) {
      for (let i = startY; i < startY + ship.length; i++) {
        board[i][startX].occupied = true
        board[i][startX].size = ship[0].size
        board[i][startX].id = ship[0].id
      }
      // console.log('bor', getShipArea(board, ship, direction, startX, startY))
    }
    getShipArea({board, ship, direction, startX, startY}).flat().forEach(field => {
      field.shipArea = true
    })
  }
  cache[`${direction}-${startX}-${startY}-${ship.length}`] = true
  return canPlaceShip
}
const handleShipGeneration = (board, ships, maxSizeY, maxSizeX) => {
  if (ships.length > 0) {
    if (placeShip(board, ships[0], maxSizeY, maxSizeX)) {
      handleShipGeneration(board, ships.filter((ship, index) => index !== 0), maxSizeY, maxSizeX)
    } else {
      handleShipGeneration(board, ships, maxSizeY, maxSizeX)
    }
  }
}

self.addEventListener('message', (
  { data }) => {
    cache = {}
    handleShipGeneration(data.rows, data.battleships, data.maxSizeY, data.maxSizeX)
    self.postMessage({ rows: data.rows })
  }
)
