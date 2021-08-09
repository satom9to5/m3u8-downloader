const browserAction = {
  setBadgeBackgroundColor: (details: chrome.browserAction.BadgeBackgroundColorDetails): void => {
    chrome.browserAction.setBadgeBackgroundColor(details)
  },
  setBadgeText: (details: chrome.browserAction.BadgeTextDetails): void => {
    chrome.browserAction.setBadgeText(details)
  },
  setIcon: (details: chrome.browserAction.TabIconDetails): void => {
    chrome.browserAction.setIcon(details)
  }
}

Object.freeze(browserAction)
export default browserAction
