<!-- AudioPlayer.vue -->
<template>
  <div class="audio-player">
    <audio ref="audioElement" :src="src" preload="auto" @loadedmetadata="onLoadedMetadata" @canplay="onCanPlay"
      @timeupdate="onTimeUpdate" @play="onPlay" @pause="onPause" @ended="onEnded" @error="onError"></audio>

    <!-- Controles -->
    <div class="controls">
      <button @click="rewind" v-if="showRewind"><i class="fa-solid fa-backward-step"></i></button>
      <button @click="togglePlay">
        <i :class="isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
      </button>
      <button @click="forward" v-if="showForward"><i class="fa-solid fa-forward-step"></i></button>
    </div>

    <!-- Barra de Progresso -->
    <div class="progress-container" v-if="showProgress">
      <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek" />
    </div>

    <!-- Tempo -->
    <div class="time-container" v-if="showProgress">
      <span class="current-time">{{ formatTime(currentTime) }}</span>
      <span class="total-time">{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>




<script>
export default {
  name: 'AudioPlayer',
  props: {
    src: {
      type: String,
      required: true,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    showRewind: {
      type: Boolean,
      default: false,
    },
    showForward: {
      type: Boolean,
      default: false,
    },
    showProgress: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isPlaying: false,
      duration: 0,
      currentTime: 0,
      audioReady: false,
    };
  },
  mounted() {
    const audio = this.$refs.audioElement;
    if (audio) {
      audio.addEventListener('error', this.onError);
    }
  },
  beforeUnmount() {
    const audio = this.$refs.audioElement;
    if (audio) {
      audio.removeEventListener('error', this.onError);
    }
  },
  methods: {
    onCanPlay() {
      this.audioReady = true;
      if (this.autoplay) {
        this.playAudio();
      }
    },
    onLoadedMetadata() {
      const audio = this.$refs.audioElement;
      if (audio) {
        this.duration = Math.floor(audio.duration);
      }
    },
    onTimeUpdate() {
      const audio = this.$refs.audioElement;
      if (audio) {
        this.currentTime = audio.currentTime;
        this.$emit('timeupdate', this.currentTime);
      }
    },
    onPlay() {
      this.isPlaying = true;
      this.$emit('play');
    },
    onPause() {
      this.isPlaying = false;
      this.$emit('pause');
    },
    togglePlay() {
      if (this.audioReady) {
        this.isPlaying ? this.pauseAudio() : this.playAudio();
      } else {
        console.warn('O áudio ainda não está pronto para ser reproduzido.');
      }
    },
    playAudio() {
      const audio = this.$refs.audioElement;
      if (audio && this.audioReady) {
        audio.play().catch((error) => {
          console.error('Erro ao tentar reproduzir o áudio:', error);
        });
      }
    },
    pauseAudio() {
      const audio = this.$refs.audioElement;
      if (audio) {
        audio.pause();
      }
    },
    seek(event) {
      const newTime = event.target.value;
      const audio = this.$refs.audioElement;
      if (audio) {
        audio.currentTime = newTime;
        this.currentTime = newTime;
      }
    },
    onEnded() {
      this.isPlaying = false;
      this.$emit('ended');
    },
    rewind() {
      this.$emit('rewind');
    },
    forward() {
      this.$emit('forward');
    },
    onError(error) {
      console.error('Erro ao carregar ou reproduzir o áudio:', error);
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secondsRemaining = Math.floor(seconds % 60);
      return `${minutes}:${secondsRemaining < 10 ? '0' + secondsRemaining : secondsRemaining}`;
    },
  },
  watch: {
    src(newSrc) {
      const audio = this.$refs.audioElement;
      if (audio) {
        audio.src = newSrc;
        audio.load();
        this.isPlaying = false;
        this.duration = 0;
        this.currentTime = 0;
        this.audioReady = false;
      }
    },
  },
};
</script>




<style scoped>
@import "@/assets/css/variables.css";

.audio-player {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controls {
  display: flex;
  align-items: center;
}

.controls button {
  background: none;
  border: none;
  color: var(--color-secondary);
  font-size: var(--size-large-1);
  margin: 0 20px;
  cursor: pointer;
}

.controls button:hover {
  color: var(--color-primary);
}

.controls button:nth-child(2) {
  background-color: rgba(var(--color-secondary-rgb), 0.2);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.controls button:nth-child(2):hover {
  background-color: rgba(var(--color-secondary-rgb), 0.4);
}

.progress-container {
  width: 100%;
  margin-top: 10px;
}

.time-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
}

.current-time,
.total-time {
  color: var(--color-primary);
  font-size: var(--size-small-3);
}

.progress-container input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background-color: var(--color-secondary);
  border-radius: 5px;
  outline: none;
  transition: background 0.3s ease;
}

.progress-container input[type='range']::-webkit-slider-runnable-track {
  background-color: var(--color-secondary);
  height: 6px;
  border-radius: 5px;
}

.progress-container input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background-color: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
}

.progress-container input[type='range']::-moz-range-track {
  background-color: var(--color-secondary);
  height: 6px;
  border-radius: 5px;
}

.progress-container input[type='range']::-moz-range-progress {
  background-color: var(--color-primary);
  height: 6px;
  border-radius: 5px;
}

.progress-container input[type='range']::-ms-track {
  background-color: transparent;
  border-color: transparent;
  color: transparent;
  height: 6px;
}

.progress-container input[type='range']::-ms-fill-lower {
  background-color: var(--color-primary);
}

.progress-container input[type='range']::-ms-fill-upper {
  background-color: var(--color-secondary);
}
</style>