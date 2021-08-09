import PageInfo from 'extractors/pageInfo'

export default abstract class BaseExtractor {
  private urlPatternRegExp: RegExp;

  public constructor() {
    this.urlPatternRegExp = new RegExp(this.urlPattern(), 'i')
  }

  protected abstract urlPattern(): string

  public matchUrl(url: string): boolean {
    return this.urlPatternRegExp.test(url)
  }

  public getMediaInfo(): MediaInfo {
    return (new PageInfo()).mediaInfo()
  }
}
