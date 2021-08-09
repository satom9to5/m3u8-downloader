export function getHostnameFromUrl(url: string): string | undefined {
  try {
    const urlObject = new URL(url)
    return urlObject.hostname
  } catch (err) {
    return undefined
  }
}
