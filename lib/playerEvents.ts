// ─── Roboflix Smart Player — Client-Side Event Engine ─────────────────────────
// All data stored in localStorage. No backend required.
// ──────────────────────────────────────────────────────────────────────────────

export type PlayerEventType =
  | "replay"
  | "pause"
  | "seek"
  | "speed_change"
  | "doubt_pin"
  | "tab_hidden"
  | "tab_visible"
  | "play"
  | "progress"

export interface PlayerEvent {
  episodeId: string
  event: PlayerEventType
  timestamp: number
  value?: string
  createdAt: number
}

export interface HeatmapBucket {
  startSecond: number
  endSecond: number
  replayIntensity: number  // 0–100
  pauseIntensity: number   // 0–100
}

export interface Bookmark {
  episodeId: string
  seasonId: number
  episodeNumber: number
  title: string
  thumbnailUrl: string
  savedTimestamp: number  // seconds in video when bookmarked
  savedAt: number         // unix ms when saved
}

export interface DoubtPin {
  episodeId: string
  timestamp: number
  createdAt: number
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const EVENTS_PREFIX = "roboflix_events_"
const HEATMAP_PREFIX = "roboflix_heatmap_"
const BOOKMARKS_KEY = "roboflix_bookmarks"
const DOUBT_PINS_PREFIX = "roboflix_doubt_pins_"
const HEATMAP_CACHE_TTL = 5 * 60 * 1000  // 5 minutes
const BUCKET_SIZE = 5  // seconds per heatmap bucket

// ─── EVENT TRACKING ───────────────────────────────────────────────────────────
export function trackEvent(
  episodeId: string,
  event: PlayerEventType,
  timestamp: number,
  value?: string
): void {
  if (typeof window === "undefined") return
  try {
    const key = EVENTS_PREFIX + episodeId
    const raw = localStorage.getItem(key)
    const events: PlayerEvent[] = raw ? JSON.parse(raw) : []
    events.push({ episodeId, event, timestamp, value, createdAt: Date.now() })
    // Keep only last 2000 events per episode to avoid storage bloat
    if (events.length > 2000) events.splice(0, events.length - 2000)
    localStorage.setItem(key, JSON.stringify(events))
    // Invalidate heatmap cache
    localStorage.removeItem(HEATMAP_PREFIX + episodeId)
  } catch (e) {
    // Fire-and-forget — never throw
  }
}

// ─── HEATMAP GENERATION ────────────────────────────────────────────────────────
export function getHeatmap(episodeId: string, duration: number): HeatmapBucket[] {
  if (typeof window === "undefined" || duration <= 0) return []

  try {
    // Check cache
    const cacheKey = HEATMAP_PREFIX + episodeId
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { data, cachedAt } = JSON.parse(cached)
      if (Date.now() - cachedAt < HEATMAP_CACHE_TTL) return data
    }

    const eventsKey = EVENTS_PREFIX + episodeId
    const raw = localStorage.getItem(eventsKey)
    const events: PlayerEvent[] = raw ? JSON.parse(raw) : []

    // Build buckets
    const numBuckets = Math.ceil(duration / BUCKET_SIZE)
    const replayCounts = new Array(numBuckets).fill(0)
    const pauseCounts = new Array(numBuckets).fill(0)

    for (const ev of events) {
      const bucketIdx = Math.min(Math.floor(ev.timestamp / BUCKET_SIZE), numBuckets - 1)
      if (ev.event === "replay" || ev.event === "seek") {
        replayCounts[bucketIdx]++
      } else if (ev.event === "pause") {
        pauseCounts[bucketIdx]++
      }
    }

    // Normalize 0-100
    const maxReplay = Math.max(...replayCounts, 1)
    const maxPause = Math.max(...pauseCounts, 1)

    const buckets: HeatmapBucket[] = replayCounts.map((rc, i) => ({
      startSecond: i * BUCKET_SIZE,
      endSecond: Math.min((i + 1) * BUCKET_SIZE, duration),
      replayIntensity: Math.round((rc / maxReplay) * 100),
      pauseIntensity: Math.round((pauseCounts[i] / maxPause) * 100),
    }))

    // Cache result
    localStorage.setItem(cacheKey, JSON.stringify({ data: buckets, cachedAt: Date.now() }))
    return buckets
  } catch (e) {
    return []
  }
}

// ─── BOOKMARKS ────────────────────────────────────────────────────────────────
export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addBookmark(bookmark: Bookmark): void {
  if (typeof window === "undefined") return
  try {
    const existing = getBookmarks().filter(b => b.episodeId !== bookmark.episodeId)
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...existing, bookmark]))
  } catch {}
}

export function removeBookmark(episodeId: string): void {
  if (typeof window === "undefined") return
  try {
    const updated = getBookmarks().filter(b => b.episodeId !== episodeId)
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated))
  } catch {}
}

export function isBookmarked(episodeId: string): boolean {
  return getBookmarks().some(b => b.episodeId === episodeId)
}

export function getBookmarkTimestamp(episodeId: string): number {
  return getBookmarks().find(b => b.episodeId === episodeId)?.savedTimestamp ?? 0
}

// ─── DOUBT PINS ───────────────────────────────────────────────────────────────
export function getDoubtPins(episodeId: string): DoubtPin[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(DOUBT_PINS_PREFIX + episodeId)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addDoubtPin(episodeId: string, timestamp: number): void {
  if (typeof window === "undefined") return
  try {
    const pins = getDoubtPins(episodeId)
    pins.push({ episodeId, timestamp, createdAt: Date.now() })
    localStorage.setItem(DOUBT_PINS_PREFIX + episodeId, JSON.stringify(pins))
    // Also track as a player event
    trackEvent(episodeId, "doubt_pin", timestamp)
  } catch {}
}

// ─── WATCH PROGRESS ───────────────────────────────────────────────────
const PROGRESS_KEY = "roboflix_watch_progress"

export interface WatchProgress {
  episodeId: string
  seasonId: number
  episodeNumber: number
  title: string
  thumbnailUrl: string
  currentTime: number
  duration: number
  percent: number  // 0–100
  updatedAt: number
}

export function saveProgress(progress: WatchProgress): void {
  if (typeof window === "undefined") return
  try {
    const all = getAllProgress()
    const idx = all.findIndex(p => p.episodeId === progress.episodeId)
    if (idx >= 0) {
      all[idx] = progress
    } else {
      all.push(progress)
    }
    // Keep only last 20 watched episodes
    const sorted = all.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 20)
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(sorted))
  } catch {}
}

export function getLastWatched(): WatchProgress | null {
  const all = getAllProgress()
  return all.length > 0 ? all[0] : null
}

export function getAllProgress(): WatchProgress[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    const arr: WatchProgress[] = raw ? JSON.parse(raw) : []
    return arr.sort((a, b) => b.updatedAt - a.updatedAt)
  } catch {
    return []
  }
}
