import { Server } from 'socket.io';

const games = new Map();

export function websocketServer(server) {
    const io = new Server(server, { transports: ['polling', 'websocket', 'webtransport'] });

    io.on('connection', (socket) => {
        socket.on('joinRoom', (id, player) => {
            socket.join(id);

            if (!games.has(id)) {
                games.set(id, {
                    turn: "X",
                    board: Array(9).fill(" "),
                    players: [],
                    start: false,
                });
            }

            const game = games.get(id);

            if (!game.players.includes(player)) {
                game.players.push(player);

                if (game.players.length === 2)
                    game.start = true;

                io.to(id).emit('update', game);
            }

            io.to(id).emit('update', game);

            socket.on('makeMove', (cellIndex) => {
                game.board[cellIndex] = game.turn;

                for (let i = 0; i < win.length; i++) {
                    const [a, b, c] = win[i];
                    if (
                        game.board[a] === game.turn &&
                        game.board[b] === game.turn &&
                        game.board[c] === game.turn
                    )
                        io.to(id).emit('gameOver', game.turn);
                }

                let draw = true;
                for (let i = 0; i < game.board.length; i++)
                    if (game.board[i] === " ") draw = false;

                if (draw) io.to(id).emit('gameOver', "draw");

                game.turn = game.turn === "X" ? "O" : "X";
                io.to(id).emit('update', game);
            });

            socket.on('resetGame', () => {
                game.turn = "X";
                game.board = Array(9).fill(" ");
                io.to(id).emit('update', game, true);
            });

            socket.on('leaveRoom', () => {
                const index = game.players.indexOf(player);
                if (index !== -1) game.players.splice(index, 1);
                if (game.players.length < 2) game.start = false;
                if (game.players.length === 0) games.delete(id);
                io.to(id).emit('update', game);
                socket.leave(id);
            });
        });
    });

    return io
}

const win = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
