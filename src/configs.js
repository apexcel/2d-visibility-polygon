import Edge from './Edge.js';

const BLOCK_SIZE = 40;
const ROWS = 20;
const COLS = 20;
const WIDTH = BLOCK_SIZE * COLS;
const HEIGHT = BLOCK_SIZE * ROWS;

const WALLS = [
    new Edge(1, 1, 1, ROWS - 1),
    new Edge(1, COLS - 1, 1, 1),
    new Edge(COLS - 1, COLS - 1, 1, ROWS - 1),
    new Edge(COLS - 1, 1, ROWS - 1, ROWS - 1),
];

Object.freeze(WALLS);

export {
    BLOCK_SIZE, WIDTH, HEIGHT, ROWS, COLS, WALLS
}