<script lang="ts" setup>
import {
  collection,
  doc,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'

useHead({
  title: 'Collaborative Emoji Art',
})

definePageMeta({
  middleware: ['authenticated'],
})

const WIDTH = 15
const HEIGHT = 15

interface PanelEmoji {
  id: string
  content: string
  createdAt: Timestamp
  displayName: string | null
  photoURL: string | null
  pos: number
  revision: number
}

const db = useFirestore()
const panelEmojisRef = collection(db, 'panelEmojis')
const user = useCurrentUser()

const myEmojiRef = computed(() => {
  return user.value && doc(panelEmojisRef, user.value.uid)
})

const myEmoji = useDocument<PanelEmoji>(myEmojiRef)

const panelEmojis = useCollection<PanelEmoji>(
  query(panelEmojisRef, orderBy('createdAt', 'asc')),
  { ssrKey: 'emojis' }
)

const mostRecentEmoji = computed(() => panelEmojis.value.at(-1))
const mostRecentEmojiRelativeTime = useRelativeTime(
  computed(() => mostRecentEmoji.value?.createdAt)
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
  if (!user.value || !myEmojiRef.value || !newEmoji.value) return

  if (myEmoji.value) {
    // update
    await updateDoc(myEmojiRef.value, {
      content: newEmoji.value,
      createdAt: serverTimestamp(),
      revision: increment(1),
      pos: i,
    })
  } else {
    // create
    await setDoc(myEmojiRef.value, {
      content: newEmoji.value,
      createdAt: serverTimestamp(),
      revision: increment(1),
      pos: i,
      displayName: user.value.displayName,
      photoURL: user.value.photoURL,
    })
  }
}
</script>

<template>
  <main>
    <h2>Emoji Panel</h2>

    <template v-if="user">
      <p v-if="myEmoji">
        Your last emoji is {{ myEmoji.content }}. You changed it
        <strong>{{ myEmoji.revision }} times</strong>.
      </p>
      <p v-else>Click somewhere to add your very own emoji to the panel.</p>
    </template>

    <p>
      There are <strong>{{ panelEmojis.length }} contributions</strong>.
    </p>

    <button class="emoji" @click="randomizeEmoji" style="font-size: 2.25rem">
      {{ newEmoji }}
    </button>

    <ClientOnly>
      <p v-if="mostRecentEmoji">
        <img
          :src="
            mostRecentEmoji.photoURL ||
            `https://i.pravatar.cc/150?u=${mostRecentEmoji.id}`
          "
          referrerpolicy="no-referrer"
          class="mini-avatar"
        />
        <span>{{ mostRecentEmoji.displayName || 'Anonymous' }}</span>
        created {{ mostRecentEmoji.content }} {{ mostRecentEmojiRelativeTime }}
      </p>
    </ClientOnly>

    <transition-group tag="div" class="emoji-grid" name="emoji-grid">
      <button
        class="emoji-button emoji"
        :class="{ 'emoji-button--mine': user && emoji?.id === user.uid }"
        v-for="(emoji, i) in emojisByPos"
        :key="emoji?.id || i"
        @click="createEmoji(i)"
      >
        {{ emoji?.content }}
      </button>
    </transition-group>
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
  /* resets */
  cursor: crosshair;
}
.emoji-button {
  /* resets */
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
.emoji-button:active {
  transform: translateY(2px);
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
