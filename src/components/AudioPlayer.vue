<!-- AudioPlayer.vue -->
<template>
  <div class="audio-player">
    <!-- Hidden Audio Element -->
    <audio
      ref="audioElement"
      :src="src"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
    ></audio>

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
      <input
        type="range"
        min="0"
        :max="duration"
        v-model="currentTime"
        @input="seek"
      />
    </div>

    <!-- Times -->
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
    };
  },
  mounted() {
    const audio = this.$refs.audioElement;

    // Adicionar eventos
    audio.addEventListener('loadedmetadata', this.onLoadedMetadata);
    audio.addEventListener('timeupdate', this.onTimeUpdate);
    audio.addEventListener('ended', this.onEnded);
    audio.addEventListener('play', this.onPlay);
    audio.addEventListener('pause', this.onPause);

    // Iniciar reprodução se autoplay estiver habilitado
    if (this.autoplay) {
      audio.play().catch((error) => {
        console.error('Erro ao tentar reproduzir o áudio:', error);
      });
    }
  },
  beforeUnmount() {
    const audio = this.$refs.audioElement;
    if (audio) {
      audio.removeEventListener('loadedmetadata', this.onLoadedMetadata);
      audio.removeEventListener('timeupdate', this.onTimeUpdate);
      audio.removeEventListener('ended', this.onEnded);
      audio.removeEventListener('play', this.onPlay);
      audio.removeEventListener('pause', this.onPause);
    }
  },
  methods: {
    onLoadedMetadata() {
      const audio = this.$refs.audioElement;
      if (!audio) return;
      this.duration = Math.floor(audio.duration);
    },
    onTimeUpdate() {
      const audio = this.$refs.audioElement;
      if (!audio) return;
      this.currentTime = audio.currentTime;
      // Emitir o currentTime para o componente pai
      this.$emit('timeupdate', this.currentTime);
    },
    onPlay() {
      const audio = this.$refs.audioElement;
      if (!audio) return;
      this.isPlaying = true;
      this.$emit('play');
    },
    onPause() {
      const audio = this.$refs.audioElement;
      if (!audio) return;
      this.isPlaying = false;
      this.$emit('pause');
    },
    togglePlay() {
      this.isPlaying ? this.pauseAudio() : this.playAudio();
    },
    playAudio() {
      const audio = this.$refs.audioElement;
      if (!audio) return;
      audio.play().catch((error) => {
        console.error('Erro ao tentar reproduzir o áudio:', error);
      });
    },
    pauseAudio() {
      const audio = this.$refs.audioElement;
      if (!audio) return;
      audio.pause();
    },
    seek(event) {
      const newTime = event.target.value;
      const audio = this.$refs.audioElement;
      if (!audio) return;
      audio.currentTime = newTime;
      this.currentTime = newTime;
    },
    onEnded() {
      const audio = this.$refs.audioElement;
      if (!audio) return;
      this.isPlaying = false;
      this.$emit('ended');
    },
    rewind() {
      this.$emit('rewind');
    },
    forward() {
      this.$emit('forward');
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secondsRemaining = Math.floor(seconds % 60);
      return `${minutes}:${secondsRemaining < 10 ? '0' + secondsRemaining : secondsRemaining}`;
    },
  },
  watch: {
    src() {
      const audio = this.$refs.audioElement;
      if (!audio) return;
      audio.src = this.src;
      audio.load();
      // Reiniciar os estados
      this.isPlaying = false;
      this.duration = 0;
      this.currentTime = 0;
      // Iniciar reprodução se autoplay estiver habilitado
      if (this.autoplay) {
        audio.play().catch((error) => {
          console.error('Erro ao tentar reproduzir o áudio:', error);
        });
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
  color: var(--secondary-color);
  font-size: 24px;
  margin: 0 20px;
  cursor: pointer;
}

.controls button:hover {
  color: var(--primary-color);
}

.controls button:nth-child(2) {
  background-color: rgba(255, 255, 255, 0.2); /* Fundo transparente */
  border-radius: 50%; /* Forma circular */
  width: 60px; /* Largura do círculo */
  height: 60px; /* Altura do círculo */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.controls button:nth-child(2):hover {
  background-color: rgba(255, 255, 255, 0.4); /* Fundo ao passar o mouse */
}

.progress-container {
  width: 100%;
  margin-top: 10px;
}

.progress-container input[type='range'] {
  width: 100%;
  margin: 0;
}

.time-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
}

.current-time,
.total-time {
  color: var(--primary-color);
  font-size: 12px;
}
</style>
