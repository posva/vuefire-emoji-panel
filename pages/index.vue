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
import { VueFirestoreDocumentData } from 'vuefire'
import { useTimeout } from '@vueuse/core'

useHead({
  title: 'Collaborative Emoji Art',
})
definePageMeta({
  middleware: ['authenticated'],
})

interface PanelEmoji {
  id: string
  content: string
  createdAt: Timestamp
  displayName: string | null
  photoURL: string | null
  pos: number
  revision: number
}
type PanelEmojiWithId = VueFirestoreDocumentData<PanelEmoji>

const db = useFirestore()
const user = useCurrentUser()
const emojisRef = collection(db, 'panelEmojis')

const WIDTH = 15
const HEIGHT = 15

const emojis = useCollection<PanelEmoji>(
  query(emojisRef, orderBy('createdAt', 'asc')),
  {
    ssrKey: 'emojis',
  }
)

// good part of vue: easy to rework the data
const emojisByPos = computed(() => {
  const result: PanelEmojiWithId[] = Array(WIDTH * HEIGHT)
  emojis.value.forEach((emoji) => {
    result[emoji.pos] = emoji
  })

  return result
})

const lastCreatedEmoji = computed(() => emojis.value.at(-1))
const lastCreationRelativeTime = useRelativeTime(
  computed(() => lastCreatedEmoji.value?.createdAt)
)

const myEmojiRef = computed(() => user.value && doc(emojisRef, user.value.uid))
const myEmoji = useDocument<PanelEmoji>(myEmojiRef)

const { ready: canCreateNewEmoji, start } = useTimeout(5000, {
  controls: true,
  immediate: false,
})

const { emoji: newContent, randomize: generateNewContent } = useRandomEmoji()
const currentHover = ref(-1)

async function createEmoji(pos: number) {
  if (!user.value || !canCreateNewEmoji.value || !myEmojiRef.value) return

  try {
    // check if the user already created an emoji before
    if (myEmoji.value != null) {
      await updateDoc(myEmojiRef.value, {
        createdAt: serverTimestamp(),
        revision: increment(1),
        pos,
        content: newContent.value,
      })
    } else {
      await setDoc(myEmojiRef.value, {
        displayName: user.value.displayName || 'anonymous',
        photoURL: user.value.photoURL || '',
        createdAt: serverTimestamp(),
        revision: increment(1),
        pos,
        content: newContent.value,
      })
    }

    // wait 5s before allowing a new creation
    start()
  } catch (error) {
    console.error(error)
  }
  currentHover.value = -1
}
</script>

<template>
  <main>
    <h2>Emoji Panel</h2>

    <p>
      Currently we have
      <strong
        >{{ emojis.length }} contribution{{
          emojis.length == 1 ? '' : 's'
        }}</strong
      >.
      <br />

      <template v-if="myEmoji"
        >Your last emoji is {{ myEmoji.content }} after
        {{ myEmoji.revision }} updates.
        <br />
      </template>
    </p>

    <button class="emoji" @click="generateNewContent()" style="font-size: 2rem">
      {{ newContent }}
    </button>

    <p v-if="lastCreatedEmoji">
      <img
        class="mini-avatar"
        referrerpolicy="no-referrer"
        :src="
          lastCreatedEmoji.photoURL ||
          `https://i.pravatar.cc/150?u=${lastCreatedEmoji.id}`
        "
        alt="Avatar"
      />
      created {{ lastCreatedEmoji.content }}
      <ClientOnly>
        <strong>{{ lastCreationRelativeTime }}</strong>
      </ClientOnly>
      after
      {{ lastCreatedEmoji.revision }} updates.
    </p>

    <transition-group tag="div" class="emoji-grid" name="emoji-grid">
      <button
        class="emoji-button emoji"
        :class="{ 'emoji-button--mine': emoji && emoji.id === user?.uid }"
        v-for="(emoji, pos) in emojisByPos"
        :key="emoji?.id || pos"
        @click="createEmoji(pos)"
        @mouseover="canCreateNewEmoji && (currentHover = pos)"
        @mouseleave="currentHover = -1"
        :aria-disabled="!canCreateNewEmoji"
      >
        {{ currentHover === pos ? newContent : emoji?.content }}
      </button>
    </transition-group>

    <p v-if="!canCreateNewEmoji">
      You added an emoji less than 5 seconds ago. Wait a bit to create a new one
      😊
    </p>
    <p v-else>Click on any box to add your very own emoji!</p>
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
