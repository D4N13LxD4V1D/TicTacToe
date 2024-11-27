<script lang="ts">
    import { enhance } from "$app/forms";
    import { browser } from "$app/environment";
    import type { PageServerData, ActionData } from "./$types";

    import x from "$lib/assets/x.png";
    import o from "$lib/assets/o.png";

    let { data, form }: { data: PageServerData; form: ActionData } = $props();
    let { room, player } = data;
</script>

<div class="lobby">
    <form method="POST" class="lobby-content" use:enhance>
        <div class="xox">
            <img src={x} alt="xox" />
            <img src={o} alt="xox" />
            <img src={x} alt="xox" />
            <img src={o} alt="xox" />
        </div>

        <label for="room">Room ID:</label>
        <input type="text" id="room" name="room" value={room} readonly />
        <br /><br />
        <br /><br />

        <label for="player">Player Name:</label>
        <input
            type="text"
            id="player"
            name="player"
            value={form?.player ?? player ?? ""}
        />
        <br /><br />

        <div class="buttons">
            <button
                type="button"
                class="buttons"
                onclick={() => {
                    if (browser) window.history.back();
                }}>BACK</button
            >
            <button type="submit" class="buttons">START</button>
        </div>
    </form>
</div>

<style>
    .lobby {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5vmin;
    }

    .xox {
        display: flex;
        justify-content: center;
        gap: 10px;
    }
    .xox img {
        display: flex;
        width: 100%;
        height: auto;
        max-width: 100px;
        margin-bottom: 20px;
        animation: popup 0.5s ease-out forwards;
    }

    .lobby-content {
        background: linear-gradient(
            45deg,
            #000,
            #2e0f1d,
            #13040a,
            #0b0615,
            #09071d,
            #2e0f1d,
            #000
        );
        box-shadow:
            -2px -2px 3px #f306cb,
            2px 2px 3px #05f0e0;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        width: 100%;
        max-width: 500px;
    }

    [type="text"] {
        width: 100%;
        max-width: 300px;
        padding: 12px 20px;
        margin: 10px 0;
        border: 2px solid #00f0ff;
        background-color: transparent;
        color: #00ffc9;
        font-size: 18px;
        font-family: "Press Start 2P", sans-serif;
        border-radius: 8px;
        text-align: center;
        outline: none;
        box-shadow: 2px 2px 10px rgba(0, 255, 201, 0.3);
        transition: all 0.3s ease;
    }

    [type="text"]:focus {
        border: 2px solid #00ffc9;
        box-shadow: 0 0 15px #00ffc9;
        background-color: #0b0615;
        color: #00ffc9;
        text-shadow: 1px 1px 2px #18668d;
    }

    label {
        font-size: 18px;
        font-family: "Press Start 2P", sans-serif;
        color: #00ffc9;
        display: block;
        margin: 3px 0;
        text-shadow: 1px 1px 2px #18668d;
    }

    .buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .buttons button {
        width: 150px;
        padding: 10px 20px;
        border: 2px solid #00f0ff;
        background-color: transparent;
        color: #00ffc9;
        font-size: 18px;
        font-family: "Press Start 2P", sans-serif;
        cursor: pointer;
        text-shadow: 1px 1px 2px #18668d;
        border-radius: 8px;
        transition: all 0.3s ease;
    }

    .buttons button:hover {
        border: 2px solid #00ffc9;
        box-shadow:
            -5px -5px 15px #00f0ff,
            5px 5px 15px #00f0ff;
        background-color: #0b0615;
        color: #00ffc9;
        text-shadow: 1px 1px 2px #18668d;
    }

    @media (max-width: 600px) {
        .lobby-content {
            width: 80%;
        }
        [type="text"],
        [type="text"]:focus {
            font-size: 16px;
        }
        .xox {
            gap: 5px;
        }
        .xox img {
            width: 60px;
        }
        .buttons {
            flex-direction: column;
        }
    }
</style>
