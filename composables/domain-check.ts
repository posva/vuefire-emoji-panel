/**
 * Ensures the domain is firebaseapp.com to avoid
 */
export function useDomainCheck() {
  onMounted(() => {
    if (process.env.NODE_ENV === 'production') {
      if (location.hostname.endsWith('.web.app')) {
        location.replace(location.href.replace('.web.app', '.firebaseapp.com'))
      }
    }
  })
}
