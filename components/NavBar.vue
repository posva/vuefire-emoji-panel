<script lang="ts" setup>
import { signOut } from 'firebase/auth'
const user = useCurrentUser()
const auth = useFirebaseAuth()!
</script>

<template>
  <nav class="links">
    <ul>
      <li>
        <NuxtLink to="/">Emoji Panel</NuxtLink>
      </li>
      <template v-if="user">
        <li>
          <NuxtLink to="/login">
            <img
              :src="user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`"
              referrerpolicy="no-referrer"
              class="nav-avatar"
            />
            {{ user.displayName || 'Anonymous' }}
          </NuxtLink>
        </li>
        <li><button @click="signOut(auth)">Logout</button></li>
      </template>
      <li v-else>
        <NuxtLink to="/login">Login</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
nav.links ul {
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
}

nav.links li a {
  position: relative;
  display: block;
  text-align: center;
  padding: 8px 12px;

  --background: var(--background-alt);
}

nav.links li a::after {
  content: '';
  position: absolute;
  z-index: -1;
  top: 75%;
  left: 0.2em;
  right: 0.2em;
  bottom: 10%;
  transition: top 200ms ease-out, background-color 200ms ease-out;
  background-color: var(--background);
  border-radius: 0.35em;
}

nav.links li a:hover::after {
  top: 10%;
  background-color: var(--background);
}

.router-link-active {
  color: #00dc82;
}
nav.links li a.router-link-active::after {
  top: 75%;
  --background: var(--border);
}
</style>
