//import BaseExtractor from 'extractors/baseExtractor'
//import { findExtractor } from 'extractors'

import tabs from 'chromeLibs/tabs'

import { isM3U8WebResponseHeaderDetails } from 'common/m3u8Detector'

import { getDownloadableSite, setDownloadableSiteFromUrl } from 'stores/downloadableSite'

import badge from 'backgrounds/browserAction/badge'

const ignoreSites: string[] = [
  "https://twitter.com/.*"
]

const ignoreSitesRegExps: RegExp[] = ignoreSites.map((ignoreSite: string) => {
  return new RegExp(ignoreSite, 'i')
})

function isIgnoreSite(url: string): boolean {
  return ignoreSitesRegExps.find(regexp => regexp.test(url)) !== undefined
}

function filterMediaRequest(detail: chrome.webRequest.WebResponseHeadersDetails): Promise<void> {
  return new Promise(async (resolve) => {
    const tab: chrome.tabs.Tab | undefined = await tabs.get(detail.tabId)

    if (tab === undefined || tab.url === undefined || isIgnoreSite(tab.url)) {
      return resolve()
    }

    if (!isM3U8WebResponseHeaderDetails(detail)) {
      return resolve()
    }

    const downloadableSite = await getDownloadableSite(tab.url)
    if (downloadableSite === undefined) {
      await setDownloadableSiteFromUrl(tab.url, false)
      badge.enable()
    } else if (downloadableSite.downloadable) {
      badge.downloadable()
    } else {
      badge.enable()
    }

    resolve()
  })
}

export default function(): void {
  chrome.webRequest.onCompleted.addListener(filterMediaRequest, { urls: ["<all_urls>"] }, ['responseHeaders'])
}
