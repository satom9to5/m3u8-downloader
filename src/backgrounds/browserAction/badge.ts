import browserAction from 'chromeLibs/browserAction'

const downloadableIconPath = {
  128: `static/images/downloadable_icon-128x128.png`,
  16: `static/images/downloadable_icon-16x16.png`,
  24: `static/images/downloadable_icon-24x24.png`,
  32: `static/images/downloadable_icon-32x32.png`,
  48: `static/images/downloadable_icon-48x48.png`,
  64: `static/images/downloadable_icon-64x64.png`,
}
Object.freeze(downloadableIconPath)

const enabledIconPath = {
  128: `static/images/enabled_icon-128x128.png`,
  16: `static/images/enabled_icon-16x16.png`,
  24: `static/images/enabled_icon-24x24.png`,
  32: `static/images/enabled_icon-32x32.png`,
  48: `static/images/enabled_icon-48x48.png`,
  64: `static/images/enabled_icon-64x64.png`,
}
Object.freeze(enabledIconPath)

const disabledIconPath = {
  128: `static/images/disabled_icon-128x128.png`,
  16: `static/images/disabled_icon-16x16.png`,
  24: `static/images/disabled_icon-24x24.png`,
  32: `static/images/disabled_icon-32x32.png`,
  48: `static/images/disabled_icon-48x48.png`,
  64: `static/images/disabled_icon-64x64.png`,
}
Object.freeze(disabledIconPath)

const badge = {
  downloadable: (): void => {
    browserAction.setIcon({ path: downloadableIconPath })
  },
  enable: (): void => {
    browserAction.setIcon({ path: enabledIconPath })
  },
  disable: (): void => {
    browserAction.setIcon({ path: disabledIconPath })
  }
}

Object.freeze(badge)
export default badge
