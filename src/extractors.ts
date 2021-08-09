import BaseExtractor from 'extractors/baseExtractor'
import TverJp from 'extractors/tverJp'

const extractors: BaseExtractor[] = [
  TverJp,
].map(klass => new klass())

export function findExtractor(url: string): BaseExtractor | undefined {
  return extractors.find(extractor => extractor.matchUrl(url))
}
