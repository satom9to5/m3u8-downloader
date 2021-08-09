import Protocol from 'devtools-protocol'

import debuggers from 'chromeLibs/debuggers'
import tabs from 'chromeLibs/tabs'

import M3U8Parser from 'common/m3u8Parser'

import { TabInfos } from 'stores/tabInfos'

export function readM3U8Response(tabId: number, requestId: string): Promise<boolean> {
  return new Promise(async (resolve) => {
    const responseBody: Object | undefined = await debuggers.sendCommand(tabId, 'Network.getResponseBody', { requestId })
    if (responseBody === undefined) {
      return resolve(false)
    }

    let tabInfo = await TabInfos.get(tabId)
    if (tabInfo === undefined) {
      return resolve(false)
    }

    const body: string = decodeResponse(responseBody as Protocol.Fetch.GetResponseBodyResponse)
    // console.log(body)
    const parser = new M3U8Parser(body)
    if (!parser.isMaster()) {
      return resolve(true)
    }

    const mediaInfo = await tabs.sendMessage(tabId, {
      type: 'getTitle',
      data: null,
    })

    if (mediaInfo === undefined || mediaInfo === null || !mediaInfo.hasOwnProperty('title')) {
      return resolve(false)
    }

    tabInfo.hls = body
    tabInfo.mediaInfo = mediaInfo
    console.log(`tab id: ${tabId}, title: ${mediaInfo.title}`)
    await TabInfos.set(tabId, tabInfo)

    resolve(true)
  })
}

function decodeResponse(responseBody: Protocol.Fetch.GetResponseBodyResponse): string {
  return responseBody.base64Encoded ? atob(responseBody.body) : responseBody.body
}
