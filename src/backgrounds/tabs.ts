import contextMenus from 'chromeLibs/contextMenus'
import tabs from 'chromeLibs/tabs'

import { getDownloadableSite } from 'stores/downloadableSite'

import badge from 'backgrounds/browserAction/badge'
import { enableDebugging, disableDebugging } from 'backgrounds/debuggers'

function tabActivated(activeInfo: chrome.tabs.TabActiveInfo | undefined): Promise<void> {
  return new Promise(async (resolve) => {
    if (activeInfo === undefined || activeInfo.tabId === undefined) {
      return resolve()
    }

    await isEnableDownload(activeInfo.tabId)
    resolve()
  })
}

function tabUpdated(tabId: number, changeInfo: chrome.tabs.TabChangeInfo): Promise<void> {
  return new Promise(async (resolve) => {
    if (changeInfo.status !== 'complete') {
      return resolve()
    }

    await isEnableDownload(tabId)
    resolve()
  })
}

function isEnableDownload(tabId: number): Promise<void> {
  return new Promise(async (resolve) => {
    const tab: chrome.tabs.Tab | undefined = await tabs.get(tabId)

    if (tab === undefined || !tab.active || tab.url === undefined) {
      badge.disable()
      await disableDebugging(tabId)
      return resolve()
    }

    const downloadableSite = await getDownloadableSite(tab.url)
    if (downloadableSite === undefined) {
      badge.disable()
      await disableDebugging(tabId)
      await contextMenus.update('m3u8-downloader-enable', { enabled: false })
    } else if (downloadableSite.downloadable) {
      badge.downloadable()
      await enableDebugging(tabId, tab.url)
      await contextMenus.update('m3u8-downloader-enable', { enabled: false })
    } else {
      badge.enable()
      await disableDebugging(tabId)
      await contextMenus.update('m3u8-downloader-enable', { enabled: true })
    }

    resolve()
  })
}

export default function(): void {
  chrome.tabs.onActivated.addListener(tabActivated)
  chrome.tabs.onUpdated.addListener(tabUpdated)
}
