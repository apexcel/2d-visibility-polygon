import Board from './Board.js';

(function App() {
    const parent = document.getElementById('App');
    document.documentElement.style.background = 'black';
    const board = new Board();
    parent.append(board.render());
})()