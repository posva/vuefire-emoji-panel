<script lang="ts">
import { GoogleAuthProvider } from 'firebase/auth'
const googleAuthProvider = new GoogleAuthProvider()
</script>

<script lang="ts" setup>
import { signInWithRedirect, signInAnonymously, signOut } from 'firebase/auth'

useHead({
  title: 'Login',
})

const auth = useFirebaseAuth()!
const user = useCurrentUser()
const route = useRoute()
</script>

<template>
  <h2>Login</h2>

  <div class="message-box" v-if="route.query.redirect">
    You need to login to access <code>{{ route.query.redirect }}</code>
  </div>

  <template v-if="user">
    <p>
      You are currently logged in as:
      <img
        :src="user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`"
        referrerpolicy="no-referrer"
        class="mini-avatar"
      />
      <span>{{ user.displayName || 'Anonymous' }}.</span>
    </p>

    <button @click="signOut(auth)">Logout</button>
  </template>

  <template v-else>
    <button @click="signInWithRedirect(auth, googleAuthProvider)">
      Sign In with Google
    </button>
    <button @click="signInAnonymously(auth)">Sign In Anonymously</button>
  </template>
</template>
