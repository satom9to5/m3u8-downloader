import BaseExtractor from 'extractors/baseExtractor'
import { findExtractor } from 'extractors'

interface OnMessageListenerFunctions {
  [key: string]: (data: any, sendResponse: (response?: any) => void) => void
}

const onMessageListenerFunctions: OnMessageListenerFunctions = {
  getTitle: (data: any, sendResponse: (response?: any) => void) => {
    // backgroundから何も渡す必要が無いため
    if (data !== null) {
      return sendResponse(null)
    }

    const extractor: BaseExtractor | undefined = findExtractor(document.URL)
    if (extractor !== null && extractor !== undefined) {
      sendResponse(extractor.getMediaInfo())
    } else {
      sendResponse(null)
    }
  }
}

export default function() {
  chrome.runtime.onMessage.addListener((message: FromBackgroundMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    if (sender.id === undefined) {
      return sendResponse(undefined)
    }

    if (!onMessageListenerFunctions.hasOwnProperty(message.type)) {
      console.error(`method: ${message.type} is not found.`)
      return sendResponse(undefined)
    }

    onMessageListenerFunctions[message.type](message.data, sendResponse)
  })
}
