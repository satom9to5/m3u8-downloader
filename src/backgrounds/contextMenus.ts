import contextMenus from 'chromeLibs/contextMenus'

import { getDownloadableSite, setDownloadableSiteFromUrl } from 'stores/downloadableSite'

import { getCurrentTab } from 'helpers/tabs'

function enableDownload(_info: chrome.contextMenus.OnClickData): Promise<void> {
  return new Promise(async (resolve) => {
    const tab = await getCurrentTab() 
    if (tab === undefined || tab.url === undefined) {
      return resolve()
    }

    const downloadableSite = await getDownloadableSite(tab.url)
    if (downloadableSite === undefined || downloadableSite.downloadable) {
      return resolve()
    }

    await setDownloadableSiteFromUrl(tab.url, true)

    resolve()
  })
}

const contextMenuProperties: chrome.contextMenus.CreateProperties[] = [
  {
    id: 'm3u8-downloader-enable',
    type: 'normal',
    title: 'Enable m3u8 download',
    enabled: false,
    contexts: ['browser_action'],
    onclick: enableDownload
  },
]

export default function() {
  contextMenuProperties.forEach((property: chrome.contextMenus.CreateProperties) => contextMenus.create(property))
}
