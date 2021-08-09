const port = chrome.runtime.connectNative("m3u8_downloader_extension")
Object.freeze(port)

export function postMessage(message: NativeMessage): void {
  // console.log(message)
  port.postMessage(message)
}

function receiveMessage(res: NativeResponse): void {
  switch (res.type) {
  case "download":
    if (res.error === "") {
      chrome.notifications.create({
        type: "basic",
        title: "m3u8 download success",
        message: `${res.data} のダウンロードが完了しました`,
        iconUrl: "static/images/downloadable_icon-48x48.png"
      })
    }
    break
  default:
    console.log(res)
    break
  }
}

export default function(): void {
  port.onMessage.addListener(receiveMessage)
}
