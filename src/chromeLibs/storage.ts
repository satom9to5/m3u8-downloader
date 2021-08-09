export interface StorageItems {
  [key: string]: any;
}

export const localStorage = {
  get: (key: string): Promise<any> => {
    return new Promise(resolve => {
      chrome.storage.local.get(key, (items: StorageItems): void => {
        if (typeof key == "string") {
          resolve(items[key]) 
        } else {
          resolve(items) 
        }
      })
    })
  },
  set: (key: string, value: any): Promise<boolean> => {
    const setValue = { [key]: value }

    return new Promise(resolve => {
      chrome.storage.local.set(setValue, (): void => {
        resolve(true) 
      })
    })
  },
  remove: (key: string): Promise<void> => {
    return new Promise(resolve => {
      chrome.storage.local.remove(key, (): void => {
        resolve() 
      })
    })
  },
  clear: (): Promise<void> => {
    return new Promise(resolve => {
      chrome.storage.local.clear((): void => {
        resolve()
      })
    })
  }
}

Object.freeze(localStorage)
