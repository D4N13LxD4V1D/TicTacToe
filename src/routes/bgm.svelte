<script lang="ts">
    import bgm from "$lib/assets/bgm.mp3?url";

    let { localAudio = $bindable() } = $props();

    let paused = $state(false);
</script>

<audio bind:this={localAudio} src={bgm} autoplay loop bind:paused>
    Your browser does not support the audio tag.
</audio>

<div class="floating-controls">
    <button onclick={() => (paused = !paused)}>{paused ? "▶" : "⏸"}</button>
</div>

<style>
    .floating-controls {
        z-index: 10000;
        position: fixed;
        top: 10px;
        right: 10px;
        border-radius: 50%;
        opacity: 0.7;
    }

    .floating-controls button {
        background-color: #000;
        color: #fff;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
    }
</style>
