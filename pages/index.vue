<script lang="ts" setup>
useHead({
  title: 'Collaborative Emoji Art',
})

const WIDTH = 15
const HEIGHT = 15
</script>

<template>
  <main>
    <h2>Emoji Panel</h2>
  </main>
</template>

<style scoped>
.emoji-grid {
  display: grid;
  margin: 1rem 0;
  grid-template-columns: repeat(v-bind(WIDTH), 1.2em);
  grid-template-rows: repeat(v-bind(HEIGHT), 1.2em);
  grid-column-gap: 4px;
  grid-row-gap: 4px;
  /* font-size: 2rem; */

  user-select: none;
}

@media screen and (min-width: 426px) {
  .emoji-grid {
    font-size: 2rem;
  }
}

.emoji-grid:hover {
  cursor: crosshair;
}

.emoji-button {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  border: solid 1px var(--border);
}

.emoji-button--mine {
  background-color: var(--highlight);
}

.emoji-button:hover {
  background-color: var(--selection);
}
.emoji-button[aria-disabled='true']:hover {
  cursor: not-allowed;
}
</style>
