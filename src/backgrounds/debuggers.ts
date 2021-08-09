import ProtocolMapping from 'devtools-protocol/types/protocol-mapping'

import debuggers from 'chromeLibs/debuggers'

import { readM3U8Response } from 'backgrounds/debuggers/m3u8'

import { isM3U8DevToolResponse } from 'common/m3u8Detector'

import { TabInfos } from 'stores/tabInfos'

function execByMethod<T extends keyof ProtocolMapping.Events>(source: chrome.debugger.Debuggee, method: T, params: ProtocolMapping.Events[T]): void {
  if (!functionsByMethod.hasOwnProperty(method)) {
    return
  }

  const targetFunction = functionsByMethod[method]
  if (typeof targetFunction !== 'function') {
    return
  }

  targetFunction(source, params as ProtocolMapping.Events[T])
}
 
type ProtocolMappingEventNames = keyof ProtocolMapping.Events
// TODO anyどうにかしたい　
type FunctionByMethodHash = {
  [K in ProtocolMappingEventNames]?: (source: chrome.debugger.Debuggee, params: ProtocolMapping.Events[K] | any) => void | Promise<any | undefined>
}

const functionsByMethod: FunctionByMethodHash = {
  'Network.responseReceived': (source: chrome.debugger.Debuggee, params: ProtocolMapping.Events['Network.responseReceived']): Promise<any | undefined> => {
    return new Promise(async (resolve) => {
      // source.tabId
      const [event] = params
      const { requestId, response } = event
      if (!isM3U8DevToolResponse(response)) {
        return resolve(undefined)
      }

      if (source.tabId === undefined) {
        return resolve(undefined)
      }

      await readM3U8Response(source.tabId, requestId)

      resolve(true)
    })
  }
}

function receiveDebuggerEvent(source: chrome.debugger.Debuggee, method: string, params?: Object): void {
  if (params === undefined) {
    return
  }

  // TODO: anyどうにかしたい　
  execByMethod(source, method as keyof ProtocolMapping.Events, [params] as [any])
}

function receiveDetachEvent(source: chrome.debugger.Debuggee, _reason: string): void {
  if (source.tabId === undefined) {
    return
  }

  disableDebugging(source.tabId)
}

export function enableDebugging(tabId: number, url?: string): Promise<void> {
  return new Promise(async (resolve) => {
    let tabInfo = await TabInfos.get(tabId)
    if (tabInfo === undefined) {
      tabInfo = { url: url, debugging: true }
    } else {
      tabInfo.debugging = true
    }

    await TabInfos.set(tabId, tabInfo)

    await debuggers.attach(tabId)
    await debuggers.sendCommand(tabId, 'Network.enable')
    resolve()
  })
}

export function disableDebugging(tabId: number): Promise<void> {
  return new Promise(async (resolve) => {
    let tabInfo = await TabInfos.get(tabId)
    if (tabInfo === undefined) {
      return resolve()
    }

    tabInfo.debugging = false
    delete tabInfo.hls
    delete tabInfo.mediaInfo
    await TabInfos.set(tabId, tabInfo)
    const attachedTarget = (await debuggers.getTargets()).find(target => target.tabId !== null && target.tabId == tabId && target.attached)
    if (attachedTarget !== undefined) {
      return
    }

    await debuggers.detach(tabId)
    resolve()
  })
}

export default function(): void {
  chrome.debugger.onEvent.addListener(receiveDebuggerEvent)
  chrome.debugger.onDetach.addListener(receiveDetachEvent)
}
