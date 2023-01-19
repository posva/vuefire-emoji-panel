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

<style>
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
  /* resets for a button */
  background-color: transparent;
  padding: 0;
  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  border: solid 1px var(--border);
}
.emoji-button:focus {
  box-shadow: none;
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

.emoji-grid-move,
.emoji-grid-enter-active,
.emoji-grid-leave-active {
  transition: all 500ms var(--ease-bezier);
}
.emoji-grid-enter-active {
  z-index: 10;
}
.emoji-grid-move {
  z-index: 15;
}

.emoji-grid-enter-from:not(:empty) {
  transform: scale(3.5);
}

.emoji-grid-enter-from,
/* both from and to to remove the leaving animation */
.emoji-grid-leave-from,
.emoji-grid-leave-to {
  opacity: 0;
}

.emoji-grid-leave-active {
  position: absolute;
}
</style>
