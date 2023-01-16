<script lang="ts" setup>
import {
  addDoc,
  collection,
  doc,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore'

useHead({
  title: 'Collaborative Emoji Art',
})

const WIDTH = 15
const HEIGHT = 15

interface PanelEmoji {
  content: string
  createdAt: Timestamp
  displayName: string
  photoURL: string
  pos: number
  revision: number
}

const db = useFirestore()
const panelEmojisRef = collection(db, 'panelEmojis-test2')
const user = useCurrentUser()

const myEmojiRef = computed(() => {
  return user.value && doc(panelEmojisRef, user.value.uid)
})

const myEmoji = useDocument<PanelEmoji>(myEmojiRef)

const panelEmojis = useCollection<PanelEmoji>(
  query(panelEmojisRef, orderBy('createdAt', 'asc')),
  { ssrKey: 'emojis' }
)

const emojisByPos = computed(() => {
  const res: PanelEmoji[] = Array(WIDTH * HEIGHT)
  for (const emoji of panelEmojis.value) {
    res[emoji.pos] = emoji
  }

  return res
})

const { emoji: newEmoji, randomize: randomizeEmoji } = useRandomEmoji()

async function createEmoji(i: number) {
  if (!user.value || !newEmoji.value) return

  await setDoc(doc(panelEmojisRef, user.value.uid), {
    content: newEmoji.value,
    createdAt: serverTimestamp(),
    displayName: user.value.displayName,
    photoURL: user.value.photoURL,
    pos: i,
    revision: increment(1),
  })
}
</script>

<template>
  <main>
    <h2>Emoji Panel</h2>

    <div class="emoji-grid">
      <div
        class="emoji-button emoji"
        v-for="(emoji, i) in emojisByPos"
        role="button"
        @click="createEmoji(i)"
      >
        {{ emoji?.content }}
      </div>
    </div>
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
.emoji-button:active {
  transform: translateY(2px);
}
.emoji-button[aria-disabled='true']:hover {
  cursor: not-allowed;
}
</style>
