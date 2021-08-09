import PageInfo from 'extractors/pageInfo'
import BaseExtractor from 'extractors/baseExtractor'

class TVerJpPageInfo extends PageInfo {
  public subtitle: string = '';
  public streamDate: string = '';

  public constructor() {
    super()

    this.title = this.title.replace(/ - 無料で動画見放題/, '')

    const titleElement = document.querySelector('div.title')
    if (titleElement === null) {
      return
    }

    this.subtitle = titleElement.querySelector('span.summary')?.textContent || ''
    this.streamDate = this.getStreamDate(titleElement.querySelector('span.tv')?.textContent)
  }

  private getStreamDate(str: string | null | undefined): string {
    if (str === null || str === undefined) {
      return ''
    }

    const monthDateMatch = str.match(/(\d+)月(\d+)日/)
    if (monthDateMatch === null) {
      return ''
    }
    const month = parseInt(monthDateMatch[1])

    const now = new Date()
    const currentYear = now.getFullYear()
    const year = month > now.getMonth() + 1 ? currentYear - 1 : currentYear
    return `${year}年${monthDateMatch[0]}`
  }

  public fileName(): string {
    const infos: string[] = [this.title]

    if (this.streamDate !== null && this.streamDate !== '') {
      infos.push(this.streamDate)
    }

    if (this.subtitle !== null && this.subtitle !== '') {
      infos.push(this.subtitle)
    }

    return infos.join(' - ')
  }
}

export default class TverJp extends BaseExtractor {
  protected urlPattern(): string {
    return 'https://tver.jp/*'
  }

  public getMediaInfo(): MediaInfo {
    const pageInfo = new TVerJpPageInfo()

    return {
      title: pageInfo.title,
      subtitle: pageInfo.subtitle,
      streamDate: pageInfo.streamDate,
      downloadFilename: pageInfo.fileName()
    }
  }
}
