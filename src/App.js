import Board from './Board.js';

(function App() {
    const parent = document.getElementById('App');
    const board = new Board();
    document.documentElement.style.background = 'black';
    parent.append(board.render());
})()