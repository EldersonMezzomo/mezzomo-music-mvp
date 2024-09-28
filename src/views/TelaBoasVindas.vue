<!-- TelaBoasVindas.vue -->
<template>
    <div class="boas-vindas">
        <header class="header">
            <h1 class="title">
                <span class="mezzomo">mezzomo </span>
                <span class="music">music</span>
            </h1>
        </header>

        <div class="welcome-content">
            <p class="presentation">
                Descubra o prazer de aprender com Mezzomo Music, a plataforma onde a música transforma o conhecimento em
                algo leve e divertido.
            </p>

            <button class="btn-entrar" @click="irParaInicio">
                Conheça a Plataforma
            </button>

            <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
            </div>
        </div>

        <div class="footer-info">
            <p>Versão Beta - Desenvolvida por Elderson Luciano Mezzomo</p>
        </div>
    </div>
</template>




<script>
export default {
    data() {
        return {
            progress: 0,
        };
    },
    created() {
        this.startProgress();
    },
    methods: {
        startProgress() {
            const interval = setInterval(() => {
                if (this.progress < 100) {
                    this.progress += (100 / (10 * 100));
                } else {
                    clearInterval(interval);
                    this.irParaInicio(); // Redirecionar automaticamente ao fim do progresso
                }
            }, 10);
        },
        irParaInicio() {
            this.$router.push({ name: 'TelaInicio' });
        },
    },
};
</script>




<style scoped>
@import "@/assets/css/variables.css";

.boas-vindas {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    overflow: hidden;
}

.header {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.title {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--color-primary);
    margin-bottom: 35px;
}

.mezzomo {
    font-family: var(--font-oxygen);
    font-size: calc(var(--size-big-1) * 2);
}

.music {
    font-family: var(--font-nunito-sans);
    font-size: calc(var(--size-big-2) * 2);
    margin-left: 12px;
    font-weight: 300;
}

.welcome-content {
    text-align: center;
    color: var(--color-secondary);
    max-width: 90%;
    word-wrap: break-word;
    margin: 0 auto;
}

.presentation {
    font-size: var(--size-large-1);
    margin-bottom: 20px;
    line-height: 2.5;
}

.btn-entrar {
    background-color: var(--color-primary);
    font-family: var(--font-nunito-sans);
    font-weight: bold;
    color: var(--color-secondary);
    font-size: var(--size-large-2);
    padding: 15px 30px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    margin-bottom: 20px;
    max-width: 100%;
    white-space: nowrap;
}

.btn-entrar:hover {
    background-color: rgba(var(--color-primary-rgb), 0.8);
}

.progress-bar-container {
    width: 80%;
    background-color: rgba(var(--color-secondary-rgb), 0.2);
    height: 6px;
    border-radius: 5px;
    margin: 20px auto 0;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background-color: var(--color-primary);
    transition: width 1s ease;
}

.footer-info {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    font-size: var(--size-small-3);
    color: var(--color-secondary);
    opacity: 0.6;
}




/* Tablet */
@media (max-width: 768px) {

    .header {
        margin-bottom: 0px;
    }

    .title {
        margin-bottom: 25px;
    }
}




/* Mobile */
@media (max-width: 480px) {

    .footer-info p {
        white-space: normal;
        text-align: center;
        padding: 0 16px;
    }
}
</style>