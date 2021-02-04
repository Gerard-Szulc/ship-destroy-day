export default {
  saveItem (key, payload) {
    localStorage.setItem(key, JSON.stringify(payload))
  },
  retrieveItem (key) {
    return JSON.parse(localStorage.getItem(key))
  },
  saveHighscore (payload) {
    let scores = JSON.parse(localStorage.getItem('scores'))
    if (!scores) {
      scores = []
    }
    scores.push(payload)
    scores.sort((a, b) => a.moves - b.moves)
    if (scores.length >= 10) {
      scores = scores.slice(0, 10)
    }
    localStorage.setItem('scores', JSON.stringify(scores))
  }
}
