import Board from './Board.js';

(function App() {
    const parent = document.getElementById('App');
    const board = new Board();
    parent.append(board.render());
})()