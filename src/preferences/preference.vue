<template>
  <div class="main">
    <section>
      <h2>Load & Save Json</h2>
      <div>
        Load Json: <input type="file" v-on:change="loadJson" />
      </div>

      <div>
        Save Json: <input type="button" id="save_json" value="Save Json" v-on:click="saveJson" /> 
      </div>
    </section>

    <section>
      <h2>Config</h2>
      
      <section>
        <h3>Download Config</h3>
  
        <div>
          Output Directory: <input
            type="text"
            name="download_dir"
            id="download_dir"
            v-model="input.download_dir"
          />
        </div>
        <div>
          Work Directory: <input
            type="text"
            name="work_dir"
            id="work_dir"
            v-model="input.work_dir"
          />
        </div>
        <div>
          FFMpeg Path: <input
            type="text"
            name="ffmpeg_path"
            id="ffmpeg_path"
            v-model="input.ffmpeg_path"
          />
        </div>
        <div>
          Log Target: <input
            type="text"
            name="log_target"
            id="log_target"
            v-model="input.log_target"
          />

          <span>(stderr is special word, others is file path.)</span>
        </div>
      </section> 

      <input type="button" id="save_config" value="Save" v-on:click="saveConfig" />
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { localStorage } from 'chromeLibs/storage'

export default Vue.extend({
  name: 'Preference',

  components: {},

  data(): any {
    return {
      input: {
        download_dir: '',
        work_dir: '',
        ffmpeg_path: '',
        log_target: '',
      }
    }
  },
  
  async created() {
    this.loadConfig()
  },

  methods: {
    async loadConfig() {
      const preference: Preference = await localStorage.get('preference')

      if (!preference) {
        return
      }

      this.input.download_dir = preference.download_dir
      this.input.work_dir = preference.work_dir
      this.input.ffmpeg_path = preference.ffmpeg_path
      this.input.log_target = preference.log_target
    },

    loadJson(e: Event) {
      if (!(e.target instanceof HTMLInputElement)) {
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result != "string") {
          return
        } 

        const jsonData: Preference = JSON.parse(reader.result)
        localStorage.set('preference', jsonData).then(() => {
          this.loadConfig()
        })
      }

      if (e.target.files && e.target.files.length > 0) {
        reader.readAsText(e.target!.files[0])
      }
    },
    
    async saveJson() {
      this.saveConfig()
      const preference: Preference = await localStorage.get('preference')

      const blob = new Blob([ JSON.stringify(preference) ], { type: 'application/json' })

      chrome.downloads.download({
        saveAs: true,
        url: window.URL.createObjectURL(blob),
        filename: 'm3u8-downloader.json'
      })
    },

    async saveConfig() {
      const preference: Preference = {...this.input}

      await localStorage.set('preference', preference)
      const backgroundPage = chrome.extension.getBackgroundPage() as ExtendWindow
      if (backgroundPage === null) {
        return
      } 

      backgroundPage.postNativeMessage({ type: "setConfig", data: preference })
    }
  }
});
</script>

<style scoped>
input {
  min-width: 500px;
}

.example {
  font-weight: bold;
}
</style>
