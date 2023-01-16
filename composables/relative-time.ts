import { MaybeRef, useNow } from '@vueuse/core'
import { Timestamp } from 'firebase/firestore'

export function useRelativeTime(when: MaybeRef<Timestamp | undefined | null>) {
  const now = useNow()

  return computed(() =>
    unref(when) == null
      ? 'never'
      : relativeSeconds(now.value.getTime(), unref(when)!.seconds * 1000)
  )
}

// time formatting
const rtf = new Intl.RelativeTimeFormat('en', { style: 'long' })
function relativeSeconds(now: number, time: number) {
  const sinceDate = Math.min(
    // only allow negative values
    -0,
    Math.floor((time - now) / 1000)
  )
  return rtf.format(sinceDate, 'seconds')
}
