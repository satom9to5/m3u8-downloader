import HLS, { Item } from 'parse-hls'

export default class M3U8Parser {
  private readonly hls: HLS

  constructor(str: string) {
    this.hls = HLS.parse(str)
    console.log(this.hls)
  }

  public isMaster(): boolean {
    return this.hls.isMaster
  }

  public getSortedStreamRendition(): Item[] {
    if (this.hls.streamRenditions.length == 0) {
      return []
    }
  
    return this.hls.streamRenditions.sort((streamRenditionA, streamRenditionB) => {
      const srAbandwidthAttribute = extractAttributeFromItem(streamRenditionA, 'streamInf', 'bandwidth', 'number')
      const srBbandwidthAttribute = extractAttributeFromItem(streamRenditionB, 'streamInf', 'bandwidth', 'number')
  
      const srAbandwidth: number = typeof srAbandwidthAttribute === 'number' ? srAbandwidthAttribute : 0
      const srBbandwidth: number = typeof srBbandwidthAttribute === 'number' ? srBbandwidthAttribute : 0
  
      return srBbandwidth - srAbandwidth
    })
  }
  
  public getStreamsWithAudio(streamRenditions: Item[] = this.hls.streamRenditions): MediaItem[] {
    if (streamRenditions.length == 0) {
      return []
    }
  
    return streamRenditions.map(streamRendition => {
      const audio = extractAttributeFromItem(streamRendition, 'streamInf', 'audio', 'string')
  
      if (typeof audio !== 'string' || this.hls.audioRenditions.length == 0) {
        return {
          video: streamRendition
        }
      }
      
      const audioRendition = this.hls.audioRenditions.find(audioRendition => {
        return extractAttributeFromItem(audioRendition, 'media', 'groupId', 'string') === audio
      })
  
      return {
        video: streamRendition,
        audio: audioRendition
      }
    })
  }

  public getSortedStreamsWithAudio(): MediaItem[] {
    return this.getStreamsWithAudio(this.getSortedStreamRendition())
  }  

  public getMaxStreamWithAudio(): MediaItem | undefined {
    const sortedStreams = this.getSortedStreamsWithAudio()
    return sortedStreams.length > 0 ? sortedStreams[0] : undefined
  }
}

export function extractAttributeFromItem(item: Item, propertyName: string, attributeName: string, attributeType: string): AttributeValue {
  const property = item.properties.find(property => {
    return property.name === propertyName &&
           typeof property.getAttribute(attributeName) === attributeType
  })

  return property !== undefined ? property.getAttribute(attributeName) : null
}
