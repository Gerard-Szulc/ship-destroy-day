<template>
  <div class="about">
    <h1>Highscores:</h1>
    <div id="highscore-list-container">
      <ul id="highscore-list">
        <template
          v-for="(score, index) in scores"
        >
          <li :key="index"><span :title="`${score.moves} | ${score.name}`">{{score.moves}} | {{score.name}}</span></li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
import localStorageClient from '@/utils/localStorageClient.js'

export default {
  data () {
    return {
      scores: []
    }
  },
  mounted () {
    this.scores = localStorageClient.getHighScores()
  }
}
</script>

<style scoped>
#highscore-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#highscore-list > li {
  width: 10rem;
  display: flex;

}
#highscore-list > li > span {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
