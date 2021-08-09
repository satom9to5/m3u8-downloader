import Protocol from 'devtools-protocol/types/protocol'

export function isM3U8MimeType(mimeType: string): boolean {
  return mimeType.indexOf('mpegurl') >= 0
}

export function isM3U8WebResponseHeaderDetails(detail: chrome.webRequest.WebResponseHeadersDetails): boolean {
  if (detail.responseHeaders === undefined) {
    return false
  }

  const mimeTypeHeader: chrome.webRequest.HttpHeader | undefined =
    detail.responseHeaders.find(header => header !== undefined && header.name.toLowerCase() === 'content-type')

  if (mimeTypeHeader === undefined || mimeTypeHeader.value === undefined) {
    return false
  }

   return isM3U8MimeType(mimeTypeHeader.value.toLowerCase())
}

export function isM3U8DevToolResponse(response: Protocol.Network.Response): boolean {
  return isM3U8MimeType(response.mimeType.toLowerCase())
}
