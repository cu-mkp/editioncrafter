const DB_NAME = 'editioncrafter-asset-cache'
const STORE_NAME = 'assets'
const DB_VERSION = 1

function openCacheDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function getCachedBuffer(url) {
  try {
    const db = await openCacheDb()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).get(url)
      req.onsuccess = () => resolve(req.result?.buffer ?? null)
      req.onerror = () => reject(req.error)
    })
  }
  catch {
    return null
  }
}

async function setCachedBuffer(url, buffer) {
  try {
    const db = await openCacheDb()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put({ buffer, cachedAt: Date.now() }, url)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }
  catch {
    // Caching is best-effort: storage may be unavailable (e.g. private
    // browsing, quota exceeded). Falling back to network-only is fine.
  }
}

async function fetchWithProgress(url, onProgress) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  const total = Number(response.headers.get('content-length')) || 0

  if (!response.body?.getReader) {
    const buffer = await response.arrayBuffer()
    onProgress?.(buffer.byteLength, total || buffer.byteLength)
    return buffer
  }

  const reader = response.body.getReader()
  const chunks = []
  let loaded = 0

  for (;;) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    chunks.push(value)
    loaded += value.byteLength
    onProgress?.(loaded, total)
  }

  const buffer = new Uint8Array(loaded)
  let offset = 0
  for (const chunk of chunks) {
    buffer.set(chunk, offset)
    offset += chunk.byteLength
  }

  return buffer.buffer
}

/**
 * Cache-first, stale-while-revalidate fetch of a binary asset via IndexedDB.
 *
 * On a cache hit, the cached bytes are returned immediately (progress jumps
 * straight to 100%) while a fresh copy is fetched in the background to keep
 * the cache up to date for the *next* load. On a cache miss, the asset is
 * streamed from the network with progress callbacks and then cached.
 */
export async function fetchCachedAsset(url, { onProgress } = {}) {
  const cached = await getCachedBuffer(url)

  if (cached) {
    onProgress?.(cached.byteLength, cached.byteLength)
    fetchWithProgress(url)
      .then(buffer => setCachedBuffer(url, buffer))
      .catch(() => {})
    return cached
  }

  const buffer = await fetchWithProgress(url, onProgress)
  await setCachedBuffer(url, buffer)
  return buffer
}
