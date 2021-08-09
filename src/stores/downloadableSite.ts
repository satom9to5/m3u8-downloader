import { localStorage } from 'chromeLibs/storage'

import { findExtractor } from 'extractors'

import { getHostnameFromUrl } from 'common/url'

export function getDownloadableSite(url: string): Promise<DownloadableSite | undefined> {
  return new Promise(async (resolve) => {
    const hostname = getHostnameFromUrl(url)
    if (hostname === undefined) {
      return resolve(undefined)
    }

    // enableはstorageの内容をそのまま返す
    const downloadableSite = await localStorage.get(hostname)
    if (downloadableSite instanceof Object && downloadableSite.hasOwnProperty('downloadable')) {
      return resolve(downloadableSite) 
    }

    if (findExtractor(url) !== undefined) {
      resolve({ downloadable: false })
    } else {
      resolve(undefined)
    }
  })
}

export function setDownloadableSiteFromUrl(url: string, downloadable: boolean): Promise<void> {
  return new Promise(async (resolve) => {
    const hostname = getHostnameFromUrl(url)
    if (hostname === undefined) {
      return resolve()
    }

    await setDownloadableSiteFromHostname(hostname, downloadable)
    resolve()
  })
}

export function setDownloadableSiteFromHostname(hostname: string, downloadable: boolean): Promise<void> {
  return new Promise(async (resolve) => {
    await localStorage.set(hostname, { downloadable }) 
    resolve()
  })
}
