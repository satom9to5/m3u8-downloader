import contextMenus from 'backgrounds/contextMenus'
import debuggers from 'backgrounds/debuggers'
import runtime, { postMessage } from 'backgrounds/runtime'
import tabs from 'backgrounds/tabs'
import webRequest from 'backgrounds/webRequest'

import { localStorage } from 'chromeLibs/storage'

contextMenus()
debuggers()
runtime()
tabs()
webRequest()

async function loadConfig() {
  const preference: Preference = await localStorage.get('preference')

  postMessage({ type: "setConfig", data: preference }) 
}

loadConfig()

;
((window as Window) as ExtendWindow).postNativeMessage = postMessage
