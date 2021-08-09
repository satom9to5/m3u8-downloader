<template>
  <div class="main">
    <h1>Select Formats</h1>

    <div v-if="loading">
      Now Loading...
    </div>

    <div v-if="!loading && streams.length == 0">
      Not Found Video Items.
    </div>

    <ul v-if="!loading && streams.length > 0">
      <h2>{{ mediaInfo.title }}</h2>

      <li class="stream" style="margin-bottom: 20px;">
        <a href="#" v-on:click="queueMaxPriorityStream">
          Max Priorty Format
        </a>
      </li>

      <li v-for="(stream, index) in streams" :key="index" class="stream">
        <a href="#" v-on:click="queueStream(index)">
          {{ extractAttributeFromItem(stream.video, 'streamInf', 'resolution', 'string') }} ({{ extractAttributeFromItem(stream.video, 'streamInf', 'bandwidth', 'number') }})
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Item } from 'parse-hls'

import { extractAttributeFromItem } from 'common/m3u8Parser'

import { getCurrentTab } from 'helpers/tabs'

import { TabInfos, createM3U8Parser } from 'stores/tabInfos'

export default Vue.extend({
  name: 'Popup',

  components: {},

  data(): any {
    return {
      m3u8Parser: null,
      streams: [],
      mediaInfo: null,
      loading: true,
    }
  },
  
  async created() {
    const currentTab: chrome.tabs.Tab = await getCurrentTab();

    if (currentTab.url === undefined || currentTab.id === undefined) {
      this.loading = false
      return
    }

    const tabInfo = await TabInfos.get(currentTab.id)
    if (tabInfo === undefined) {
      this.loading = false
      return
    }

    this.m3u8Parser = createM3U8Parser(tabInfo)
    if (this.m3u8Parser === undefined) {
      this.loading = false
      return
    }

    this.streams = this.m3u8Parser.getSortedStreamsWithAudio()
    this.mediaInfo = tabInfo.mediaInfo
    this.loading = false
  },

  methods: {
    extractAttributeFromItem(item: Item | undefined, propertyName: string, attributeName: string, attributeType: string): AttributeValue {
      if (item !== undefined) {
        return extractAttributeFromItem(item, propertyName, attributeName, attributeType)
      } else {
        return ''
      }
    },
    async queueMaxPriorityStream() {
      const maxPriorityStream = this.m3u8Parser.getMaxStreamWithAudio()
      console.log(maxPriorityStream)
      if (maxPriorityStream == null) {
        return
      }

      const downloadData: NativeDownloadData = {
        video_url: maxPriorityStream.video.uri,
        audio_url: maxPriorityStream.hasOwnProperty('audio') ? maxPriorityStream.audio.uri : '',
        filename: this.mediaInfo.downloadFilename
      }

      const backgroundPage = chrome.extension.getBackgroundPage() as ExtendWindow
      if (backgroundPage === null) {
        return
      } 

      backgroundPage.postNativeMessage({ type: "download", data: downloadData })
    },    
    async queueStream(index: number) {
      const stream = this.streams[index]
      console.log(stream)
      const downloadData: NativeDownloadData = {
        video_url: stream.video.uri,
        audio_url: stream.hasOwnProperty('audio') ? stream.audio.uri : '',
        filename: this.mediaInfo.downloadFilename
      }

      const backgroundPage = chrome.extension.getBackgroundPage() as ExtendWindow
      if (backgroundPage === null) {
        return
      } 

      backgroundPage.postNativeMessage({ type: "download", data: downloadData })
    }
  }
});
</script>

<style scoped>
div.main {
  min-width: 400px;
}

li {
  list-style: none;
}

li.stream {
  border: medium solid #000000;
  margin: 10px 0 10px 0;
  padding: 5px 0 5px 0;
  background-color: #ccff88;
}
</style>
