import { BLOCK_SIZE, WIDTH, HEIGHT, ROWS, COLS } from './configs.js';
import * as draw from './draw.js';

const LEFT = 0;
const UP = 1;
const DOWN = 2;
const RIGHT = 3;

function clickHandler(e, board) {
    const targetX = e.offsetX, targetY = e.offsetY;
    const x = Math.floor(targetX / BLOCK_SIZE), y = Math.floor(targetY / BLOCK_SIZE);

    board.tableMap[y][x].exist = !board.tableMap[y][x].exist;
    board.convToEdge();
    board.drawBlock();
}

class Edge {
    constructor(x1, x2, y1, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
}

class Board {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.canvas.width = WIDTH;
        this.ctx.canvas.height = HEIGHT;
        this.ctx.canvas.style.background = 'black';
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

        this.init();
    }

    init = () => {
        this.tableMap = Array.from(Array(COLS), () => Array(ROWS));
        for (let y = 0; y < ROWS; y += 1) {
            for (let x = 0; x < COLS; x += 1) {
                this.tableMap[y][x] = {
                    exist: false,
                    edgeExist: [false, false, false, false],
                    edgeIds: [-1, -1, -1, -1],
                };
            }
        }
        this.edges = [];
        this.canvas.addEventListener('mousedown', e => clickHandler(e, this));
    }

    drawBlock = () => {
        this.tableMap.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col.exist) {
                    this.ctx.clearRect(x, y, 1, 1);
                    draw.fillRect(this.ctx, x, y, BLOCK_SIZE);
                }
                else {
                    this.ctx.clearRect(x, y, 1, 1);
                }
            })
        })

        for (let i = 0; i < this.edges.length; i += 1) {
            const { x1, x2, y1, y2 } = this.edges[i];
            draw.line(this.ctx, x1, y1, x2, y2, {
                strokeStyle: 'wheat',
                lineWidth: 0.1,
            })
            draw.circle(this.ctx, x1, y1, 0.1, 'red');
            draw.circle(this.ctx, x2, y2, 0.1, 'red');
        }
    }

    convToEdge = () => {
        this.edges = [];
        for (let y = 1; y < ROWS - 1; y += 1) {
            for (let x = 1; x < COLS - 1; x += 1) {
                const current = this.tableMap[y][x];
                const left = this.tableMap[y][x - 1];
                const up = this.tableMap[y - 1][x];
                const down = this.tableMap[y + 1][x];
                const right = this.tableMap[y][x + 1];


                // 현재 블록이 존재하는가
                if (current.exist) {
                    current.edgeIds = [-1, -1, -1, -1];
                    current.edgeExist = [false, false, false, false];
                    // 블록 좌측
                    if (!current.edgeExist[LEFT]) {
                        // 현재 블록 왼쪽 라인이 존재하지 않으면
                        if (!left.exist) {
                            // 위 블록은 왼쪽 라인이 존재하면 연장 그렇지 않으면 새 라인 생성
                            if (up.exist && up.edgeExist[LEFT]) {
                                console.log('up exist', up.exist)
                                this.edges[up.edgeIds[LEFT]].y2 += 1;
                                current.edgeIds[LEFT] = up.edgeIds[LEFT];
                                current.edgeExist[LEFT] = true;
                            }
                            else {
                                console.log('not up exist')
                                const edge = new Edge(x, x, y, y + 1);
                                const edgeId = this.edges.length;
                                this.edges.push(edge);

                                current.edgeIds[LEFT] = edgeId;
                                current.edgeExist[LEFT] = true;
                            }
                        }
                    }

                    if (!current.edgeExist[RIGHT]) {
                        if (!right.exist) {
                            if (up.exist && up.edgeExist[RIGHT]) {
                                this.edges[up.edgeIds[RIGHT]].y2 += 1;
                                current.edgeIds[RIGHT] = up.edgeIds[RIGHT];
                                current.edgeExist[RIGHT] = true;
                            }
                            else {
                                const edge = new Edge(x + 1, x + 1, y, y + 1);
                                const edgeId = this.edges.length;
                                this.edges.push(edge);

                                current.edgeIds[RIGHT] = edgeId;
                                current.edgeExist[RIGHT] = true;
                            }
                        }
                    }

                    if (!current.edgeExist[UP]) {
                        if (!up.exist) {
                            if (left.exist && left.edgeExist[UP]) {
                                this.edges[left.edgeIds[UP]].x2 += 1;
                                current.edgeIds[UP] = left.edgeIds[UP];
                                current.edgeExist[UP] = true;
                            }
                            else {
                                const edge = new Edge(x, x + 1, y, y);
                                const edgeId = this.edges.length;
                                this.edges.push(edge);

                                current.edgeIds[UP] = edgeId;
                                current.edgeExist[UP] = true;
                            }
                        }
                    }

                    if (!current.edgeExist[DOWN]) {
                        if (!down.exist) {
                            if (left.exist && left.edgeExist[DOWN]) {
                                this.edges[left.edgeIds[DOWN]].x2 += 1;
                                current.edgeIds[DOWN] = left.edgeIds[DOWN];
                                current.edgeExist[DOWN] = true;
                            }
                            else {
                                const edge = new Edge(x, x + 1, y + 1, y + 1);
                                const edgeId = this.edges.length;
                                this.edges.push(edge);

                                current.edgeIds[DOWN] = edgeId;
                                current.edgeExist[DOWN] = true;
                            }
                        }
                    }

                }
            }
        }
        console.log(this.edges)
    }

    render = () => this.canvas;
}

export default Board;