const nativeMessageType = 'setConfig' | 'download'

type NativeMessage = {
  type: nativeMessageType,
  data: Preference | NativeDownloadData
}

type NativeDownloadData = {
  video_url: string,
  audio_url?: string,
  filename: string
}

type NativeResponse = {
  type: string,
  data: any,
  error: string
}
