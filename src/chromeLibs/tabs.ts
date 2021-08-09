const tabs = {
  get: (tabId: number): Promise<chrome.tabs.Tab | undefined> => {
    return new Promise(resolve => {
      if (tabId <= 0) {
        return resolve(undefined)
      }

      try {
        chrome.tabs.get(tabId, (tab: chrome.tabs.Tab) => {
          resolve(tab) 
        })
      } catch (error) {
        console.error(error)
        resolve(undefined)
      }
    })
  },
  query: (queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]> => {
    return new Promise(resolve => {
      chrome.tabs.query(queryInfo, (tabs: chrome.tabs.Tab[]) => {
        resolve(tabs) 
      })
    })
  },
  create: (properties: chrome.tabs.CreateProperties): Promise<chrome.tabs.Tab> => {
    return new Promise(resolve => {
      chrome.tabs.create(properties, (tab: chrome.tabs.Tab) => {
        resolve(tab) 
      })
    })
  },
  sendMessage: (tabId: number, message: FromBackgroundMessage): Promise<any> => {
    return new Promise(resolve => {
      chrome.tabs.sendMessage(tabId, message, {}, (response: any) => {
        resolve(response) 
      })
    })
  }
}

Object.freeze(tabs)
export default tabs
