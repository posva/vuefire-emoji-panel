<script lang="ts" setup>
const user = useCurrentUser()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  watch(user, (user, previousUser) => {
    // user logged out
    if (previousUser && !user) {
      router.push('/login')
    } else if (
      !previousUser &&
      user &&
      typeof route.query.redirect === 'string'
    ) {
      // user logged in
      router.push(route.query.redirect)
    }
  })
})

// for demo purposes only
useDomainCheck()
</script>

<template>
  <div class="container">
    <NavBar />

    <h1>Emoji Panel</h1>

    <NuxtPage />

    <footer>
      <a href="https://github.com/posva/vuefire-emoji-panel" rel="noreferrer">
        <img
          src="@/assets/github-logo.svg"
          alt="GitHub logo"
          class="logo github"
        />
        Source Code
      </a>
    </footer>
  </div>
</template>
