<script lang="ts">
    import Popup from "./popup.svelte";

    import { invalidateAll } from "$app/navigation";
    import { browser } from "$app/environment";

    import { socket } from "$lib";
    import type { PageServerData } from "./$types";

    import x from "$lib/assets/x.png";
    import o from "$lib/assets/o.png";

    import clickSound from "$lib/assets/clicksound.wav?url";
    import popupMusic from "$lib/assets/gameover.mp3?url";

    let {
        data,
        gameStartMessage = $bindable(),
        gameWaitMessage = $bindable(),
        popup = $bindable(),
    }: {
        data: PageServerData;
        gameStartMessage: HTMLDivElement;
        gameWaitMessage: HTMLDivElement;
        popup: Popup;
    } = $props();

    let { room, player } = data;
    socket.emit("joinRoom", room, player);

    let turn = $state("X");
    let players = $state(Array(2));
    let board = $state(Array(9));

    let myTurn = $derived(["X", "O"].at(players.indexOf(player)));

    let gameStartMessageShown = $state(false);

    socket.on("update", (game, reset) => {
        const audio = new Audio(clickSound);
        audio.volume = 0.5;
        audio.play();

        turn = game.turn;
        board = game.board;
        players = game.players;

        if (reset) {
            popup.hidePopup();
            gameStartMessageShown = false;
        }

        for (let i = 0; i < board.length; i++) {
            const button = document.getElementById(String(i));
            if (board[i] === " ")
                (button as HTMLButtonElement).disabled =
                    game.start && turn !== myTurn;
            else (button as HTMLButtonElement).disabled = true;
        }

        if (!game.start || players.length < 2) {
            gameWaitMessage.style.display = "flex";
            popup.hidePopup();
        } else {
            if (!gameStartMessageShown) {
                gameStartMessageShown = true;

                gameWaitMessage.style.display = "none";
                gameStartMessage.style.display = "flex";

                setTimeout(() => {
                    gameStartMessage.style.display = "none";
                }, 2500);
            }
        }
    });

    socket.on("gameOver", (winner) => {
        if (winner === "draw") popup.showPopup("DRAW!");
        else if (winner === myTurn) popup.showPopup("YOU WON!");
        else popup.showPopup("YOU LOST!");
    });

    const click = (e: MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        const cellIndex = Number(target.id);
        socket.emit("makeMove", cellIndex);
    };

    const open = () => {
        const popup = new Audio(popupMusic);
        popup.volume = 0.5;
        popup.play();
    };

    const close = () => {
        restart();
        socket.emit("leaveRoom");

        if (browser) {
            window.history.back();
            invalidateAll();
        }
    };

    const restart = () => {
        socket.emit("resetGame");
        gameStartMessageShown = false;
    };
</script>

<div id="game">
    <div class="turn">
        <p>TIC-TAC-TOE</p>
    </div>
    <div class="gameBoard">
        <div class={turn === "X" ? "player glow" : "player"} id="player1">
            <h1>X</h1>
            <p>{players[0] ?? "PLAYER 1"}</p>
        </div>
        <section class="gameBox">
            <button id="0" onclick={click}>{board[0]}</button>
            <button id="1" onclick={click}>{board[1]}</button>
            <button id="2" onclick={click}>{board[2]}</button>
            <button id="3" onclick={click}>{board[3]}</button>
            <button id="4" onclick={click}>{board[4]}</button>
            <button id="5" onclick={click}>{board[5]}</button>
            <button id="6" onclick={click}>{board[6]}</button>
            <button id="7" onclick={click}>{board[7]}</button>
            <button id="8" onclick={click}>{board[8]}</button>
        </section>
        <div class={turn === "O" ? "player glow" : "player"} id="player2">
            <h1>O</h1>
            <p>{players[1] ?? "PLAYER 2"}</p>
        </div>
    </div>
    <div class="buttons">
        <button class="buttons" onclick={restart}>RESTART</button>
        <button class="buttons" onclick={close}>DISCONNECT</button>
    </div>
</div>

<Popup bind:this={popup} {open} {close} {restart} />

<div class="game-start" bind:this={gameStartMessage}>
    <div class="game-start-container">
        <div class="xox">
            <img src={x} alt="xox" />
            <img src={o} alt="xox" />
            <img src={x} alt="xox" />
        </div>
        <p class="start-message">GAME START!</p>
    </div>
</div>

<div class="game-start" bind:this={gameWaitMessage}>
    <div class="game-start-container">
        <div class="xox">
            <img src={x} alt="xox" />
            <img src={o} alt="xox" />
            <img src={x} alt="xox" />
        </div>
        <p class="start-message">WAITING FOR PLAYERS TO JOIN {room}...</p>
    </div>
</div>

<style>
    #game {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2vmin;
    }

    .turn {
        display: flex;
        align-items: baseline;
        justify-content: center;
        width: 70vmin;
        padding: 10px;
        border: solid #00f0ff;
        border-radius: 15px;
        outline: none;
        font-family: "Press Start 2P", system-ui;
        font-size: 18px;
        background-color: transparent;
    }

    .turn p {
        width: auto;
        text-align: center;
        position: relative;
        font-family: "Press Start 2P", system-ui;
        font-size: 18px;
        background-color: transparent;
        color: #00ffc9;
        text-shadow: 1px 1px #9ffff8;
        animation: pass 4s linear infinite;
    }

    @keyframes pass {
        0% {
            transform: translateX(-4vh);
        }

        50% {
            transform: translateX(4vh);
        }

        100% {
            transform: translateX(-4vh);
        }
    }

    .gameBox {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 2vmin;
        border-radius: 10px;
        box-shadow:
            -2px -2px 3px #f306cb,
            2px 2px 3px #05f0e0;
        padding: 15px;
    }

    .gameBox button {
        cursor: pointer;
        background: #000;
        box-shadow:
            -2px -2px 3px #9ffff8,
            2px 2px 3px #9ffff8;
        height: 20vmin;
        width: 20vmin;
        border: none;
        border-radius: 8px;
        font-family: "Permanent Marker", cursive;
        font-size: 12vmin;
        color: #ffffff;
    }

    .gameBoard {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2.5vmin;
        width: 100%;
    }
    @media (max-width: 600px) {
        .gameBox {
            width: 60%;
        }
        .gameBox button {
            width: auto;
        }
    }

    .player {
        width: 15vmin;
        height: 15vmin;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 15px;
        font-family: "Press Start 2P", system-ui;
        background-color: #000;
        box-shadow:
            -2px -2px 3px #f306cb,
            2px 2px 3px #f306cb;
        box-sizing: border-box;
    }

    .player h1 {
        width: auto;
        padding: 10px 13px 2px 20px;
        border: none;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 7vmin;
        color: #8c52ff;
    }

    .player p {
        margin-top: 5px;
        font-size: 1.5vmin;
        color: #00ffc9;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .glow {
        animation: glowing 1.5s ease-in-out infinite;
    }

    .buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
    }

    .buttons button {
        width: auto;
        min-width: 200px;
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
        .buttons {
            flex-direction: column;
        }
    }

    /* GAME START ONLOAD */
    .game-start {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.907);
        z-index: 9999;
        display: none;
    }

    .game-start-container {
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        width: 100%;
        max-width: 800px;
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
        max-width: 120px;
        margin-bottom: 20px;
        animation: popup 0.5s ease-out forwards;
    }

    .start-message {
        font-family: "Press Start 2P", system-ui;
        font-size: 50px;
        color: #00ffc9;
        animation: reveal 2s ease-out forwards;
        opacity: 0;
    }

    @keyframes reveal {
        0% {
            transform: scale(0.5);
            opacity: 0;
        }
        50% {
            transform: scale(1.2);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes glowing {
        0% {
            box-shadow:
                0 0 5px #f306cb,
                0 0 10px #f306cb;
        }
        50% {
            box-shadow:
                0 0 20px #f306cb,
                0 0 30px #f306cb;
        }
        100% {
            box-shadow:
                0 0 5px #f306cb,
                0 0 10px #f306cb;
        }
    }

    @keyframes popup {
        0% {
            opacity: 0;
            transform: translate(100%, 100%) rotate(720deg);
        }
        100% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg);
        }
    }
</style>
