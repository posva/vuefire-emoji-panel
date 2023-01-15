<script lang="ts">
import { GoogleAuthProvider } from 'firebase/auth'
export const googleAuthProvider = new GoogleAuthProvider()
</script>

<script lang="ts" setup>
import { signInAnonymously, signInWithRedirect, signOut } from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'

useHead({
  title: 'Login',
})

const auth = useFirebaseAuth()! // only exists on client side
const user = useCurrentUser()

function signinRedirect() {
  return signInWithRedirect(auth, googleAuthProvider)
}
</script>

<template>
  <h2>Login</h2>

  <template v-if="user === undefined">
    <p>Loading...</p>
  </template>

  <template v-else>
    <p>Choose a signin method:</p>

    <div v-if="$route.query.redirect" class="message-box">
      <p>
        Please login to access <code>{{ $route.query.redirect }}</code
        >.
      </p>
    </div>

    <template v-if="user">
      <p>
        You are currently logged in as:
        <img
          class="mini-avatar"
          :src="user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`"
          referrerpolicy="no-referrer"
        />
        <span>{{ user.displayName || 'Anonymous' }}.</span>
      </p>

      <button @click="signOut(auth)">Logout</button>
    </template>

    <template v-else>
      <button @click="signinRedirect()">Sign in with Google</button>
      <button @click="signInAnonymously(auth)">Sign in anonymously</button>
    </template>
  </template>
</template>
