export default class PageInfo {
  public title: string = '';

  public constructor() {
    const titles = document.getElementsByTagName('title')
    if (titles !== undefined && titles !== null && titles instanceof HTMLCollection && titles.length > 0) {
      this.title = titles[0].textContent || ''
    }
  }

  public mediaInfo(): MediaInfo {
    return {
      title: this.title,
      downloadFilename: this.title
    }
  }
}
