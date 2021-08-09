const debuggers = {
  attach: (tabId: number): Promise<void> => {
    return new Promise((resolve) => {
      if (tabId <= 0) {
        return
      }

      chrome.debugger.attach({tabId}, "1.3", () => {
        resolve()
      })
    })
  },
  detach: (tabId: number): Promise<void> => {
    return new Promise((resolve) => {
      if (tabId <= 0) {
        return
      }

      chrome.debugger.detach({tabId}, () => {
        resolve()                     
      })
    })
  },
  getTargets: (): Promise<chrome.debugger.TargetInfo[]> => {
    return new Promise((resolve) => {
      chrome.debugger.getTargets((result: chrome.debugger.TargetInfo[]) => resolve(result))
    })
  },
  sendCommand: (tabId: number, method: string, commandParams?: Object): Promise<Object | undefined> => {
    return new Promise((resolve) =>  {
      if (tabId <= 0) {
        return resolve(undefined)
      }

      chrome.debugger.sendCommand({tabId}, method, commandParams, (result?: Object) => {
        resolve(result)
      })
    })
  },
}

Object.freeze(debuggers)
export default debuggers
