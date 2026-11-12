import { generalGreetings } from '../data/generalGreetings'
import { getFriendGreeting } from '../data/friends'

const ASSIGNMENTS_KEY = 'christmas-exe:greeting-assignments'

export interface PersonalizedGreeting {
  name: string
  message: string
  signoff?: string
  icon: string
  theme: string
  kind: 'friend' | 'general'
}

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

function readAssignments(storage: Storage): Record<string, string> {
  const saved = storage.getItem(ASSIGNMENTS_KEY)
  if (!saved) return {}

  const parsed: unknown = JSON.parse(saved)
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Saved greeting assignments are not valid.')
  }

  return Object.fromEntries(
    Object.entries(parsed).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}

export function selectGreeting(name: string, storage: Storage = window.localStorage): PersonalizedGreeting {
  const cleanName = normalizeName(name)
  const friend = getFriendGreeting(cleanName)
  if (friend) return { ...friend, kind: 'friend' }

  const normalizedKey = cleanName.toLowerCase()
  const assignments = readAssignments(storage)
  const assignedId = assignments[normalizedKey]
  const assignedGreeting = generalGreetings.find((greeting) => greeting.id === assignedId)
  if (assignedGreeting) {
    return {
      name: cleanName,
      message: assignedGreeting.message.split('{name}').join(cleanName),
      icon: assignedGreeting.icon,
      theme: assignedGreeting.theme,
      kind: 'general',
    }
  }

  const usageCounts = new Map<string, number>()
  for (const id of Object.values(assignments)) {
    usageCounts.set(id, (usageCounts.get(id) ?? 0) + 1)
  }
  const leastUsedCount = Math.min(...generalGreetings.map((greeting) => usageCounts.get(greeting.id) ?? 0))
  const leastUsedGreetings = generalGreetings.filter(
    (greeting) => (usageCounts.get(greeting.id) ?? 0) === leastUsedCount,
  )
  const selected = leastUsedGreetings[Math.floor(Math.random() * leastUsedGreetings.length)]

  assignments[normalizedKey] = selected.id
  storage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments))

  return {
    name: cleanName,
    message: selected.message.split('{name}').join(cleanName),
    icon: selected.icon,
    theme: selected.theme,
    kind: 'general',
  }
}
