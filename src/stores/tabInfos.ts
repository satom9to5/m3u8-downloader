import { localStorage } from 'chromeLibs/storage'

import M3U8Parser from 'common/m3u8Parser'

export function createM3U8Parser(tabInfo: TabInfo): M3U8Parser | undefined {
  if (tabInfo.hls !== undefined) {
    return new M3U8Parser(tabInfo.hls)
  } else {
    return undefined
  }
}

export class TabInfos {
  public static get(tabId: number): Promise<TabInfo | undefined> {
    return new Promise(async (resolve) => {
      const value = await localStorage.get(String(tabId))
      resolve(value !== undefined ? value as TabInfo : undefined)
    })
  }

  public static set(tabId: number, tabInfo: TabInfo): Promise<void> {
    return new Promise(async (resolve) => {
      await localStorage.set(String(tabId), tabInfo)
      resolve()
    })
  }

  public static remove(tabId: number): Promise<void> {
    return new Promise(async (resolve) => {
      localStorage.remove(String(tabId))
      resolve()
    })
  }
}
