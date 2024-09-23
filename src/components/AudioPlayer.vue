<!-- AudioPlayer.vue -->
<template>
  <div class="audio-player">
    <!-- Controls -->
    <div class="controls">
      <button @click="rewind" v-if="showRewind"><i class="fas fa-backward"></i></button>
      <button @click="togglePlay">
        <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
      </button>
      <button @click="forward" v-if="showForward"><i class="fas fa-forward"></i></button>
    </div>
    <!-- Progress Bar -->
    <div class="progress-container" v-if="showProgress">
      <span>{{ formatTime(currentTime) }}</span>
      <input
        type="range"
        min="0"
        :max="duration"
        v-model="currentTime"
        @input="seek"
      />
      <span>{{ formatTime(duration) }}</span>
    </div>
    <!-- Hidden Audio Element -->
    <audio
      :src="src"
      @loadedmetadata="atualizarDuracao"
      @timeupdate="updateCurrentTime"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
    ></audio>
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
      audio: null,
      isPlaying: false,
      duration: 0,
      currentTime: 0,
      updateInterval: null,
    };
  },
  mounted() {
    this.audio = new Audio(this.src);
    this.audio.addEventListener('loadedmetadata', this.onLoadedMetadata);
    this.audio.addEventListener('timeupdate', this.onTimeUpdate);
    this.audio.addEventListener('ended', this.onEnded);
    if (this.autoplay) {
      this.playAudio();
    }
  },
  beforeUnmount() {
    this.pauseAudio();
    this.audio.removeEventListener('loadedmetadata', this.onLoadedMetadata);
    this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
    this.audio.removeEventListener('ended', this.onEnded);
    this.audio = null;
  },
  methods: {
    onLoadedMetadata() {
      this.duration = Math.floor(this.audio.duration);
    },
    onTimeUpdate() {
      this.currentTime = Math.floor(this.audio.currentTime);
    },
    togglePlay() {
      this.isPlaying ? this.pauseAudio() : this.playAudio();
    },
    playAudio() {
      this.audio.play();
      this.isPlaying = true;
      this.$emit('play');
    },
    pauseAudio() {
      this.audio.pause();
      this.isPlaying = false;
      this.$emit('pause');
    },
    seek() {
      this.audio.currentTime = this.currentTime;
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
    atualizarDuracao(event) {
      this.duration = Math.floor(event.target.duration); // Update the real duration
      this.$emit('update-duracao', this.duration); // Emit the duration to the parent component
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secondsRemaining = Math.floor(seconds % 60);
      return `${minutes}:${secondsRemaining < 10 ? '0' + secondsRemaining : secondsRemaining}`;
    }
  },
  watch: {
    src(newSrc) {
      if (this.audio) {
        this.pauseAudio();
        this.audio.src = newSrc;
        this.audio.load();
        if (this.autoplay) {
          this.playAudio();
        }
      }
    },
  },
};
</script>

<style scoped>
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
  color: var(--secondary-color);
  font-size: 24px;
  margin: 0 10px;
  cursor: pointer;
}

.controls button:hover {
  color: var(--primary-color);
}

.progress-container {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-top: 10px;
}

.progress-container span {
  width: 40px;
  text-align: center;
}

.progress-container input[type='range'] {
  flex: 1;
  margin: 0 10px;
}
</style>
