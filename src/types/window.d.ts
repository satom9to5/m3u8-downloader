interface ExtendWindow extends Window {
  postNativeMessage: (message: NativeMessage) => void 
}
