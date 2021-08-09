const contextMenus = {
  create: (properties: chrome.contextMenus.CreateProperties): Promise<void> => {
    return new Promise((resolve) => {
      chrome.contextMenus.create(properties, () => resolve())
    })
  },
  update: (id: string, properties: chrome.contextMenus.UpdateProperties): Promise<void> => {
    return new Promise((resolve) => {
      chrome.contextMenus.update(id, properties, () => resolve())
    })
  },
  remove: (id: string): Promise<void> => {
    return new Promise((resolve) => {
      chrome.contextMenus.remove(id, () => resolve())
    })
  }
}

Object.freeze(contextMenus)
export default contextMenus
