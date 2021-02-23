import { BLOCK_SIZE, WIDTH, HEIGHT, ROWS, COLS } from './configs.js';
import * as draw from './draw.js';

const LEFT = 0;
const UP = 1;
const DOWN = 2;
const RIGHT = 3;

function clickHandler(e, board) {
    const targetX = e.offsetX, targetY = e.offsetY;
    const x = Math.floor(targetX / BLOCK_SIZE), y = Math.floor(targetY / BLOCK_SIZE);

    if (e.button === 0) {
        board.world[y][x].exist = !board.world[y][x].exist;
        board.convToEdge();
        draw.drawFrame(board);
    }
        board.calcVisibility(x, y, 1);
    if (e.button === 1) {
        e.preventDefault();
        if (board.store.length > 1) {
            console.log(board.store)
            for (let i = 0; i < board.store.length - 1; i += 1) {
                draw.fillTriangle(board.ctx, x, y, board.store[i].x, board.store[i].y, board.store[i + 1].x, board.store[i + 1].y)
            }
            draw.fillTriangle(board.ctx, x, y, board.store[board.store.length - 1].x, board.store[board.store.length - 1].y, board.store[0].x, board.store[0].y)
        }
    }
}

class Edge {
    constructor(x1, x2, y1, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
}

class RayData {
    constructor(angle, x, y) {
        this.angle = angle;
        this.x = x;
        this.y = y;
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
        this.world = Array.from(Array(COLS), () => Array(ROWS));
        for (let y = 0; y < ROWS; y += 1) {
            for (let x = 0; x < COLS; x += 1) {
                this.world[y][x] = {
                    exist: false,
                    edgeExist: [false, false, false, false],
                    edgeIds: [-1, -1, -1, -1],
                };
            }
        }
        this.edges = [];
        this.store = [];
        this.canvas.addEventListener('mousedown', e => clickHandler(e, this));
    }

    convToEdge = () => {
        this.edges = [];
        for (let y = 1; y < ROWS - 1; y += 1) {
            for (let x = 1; x < COLS - 1; x += 1) {
                const current = this.world[y][x];
                const left = this.world[y][x - 1];
                const up = this.world[y - 1][x];
                const down = this.world[y + 1][x];
                const right = this.world[y][x + 1];


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
                                this.edges[up.edgeIds[LEFT]].y2 += 1;
                                current.edgeIds[LEFT] = up.edgeIds[LEFT];
                                current.edgeExist[LEFT] = true;
                            }
                            else {
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

    calcVisibility = (originX, originY, radius) => {
        this.store = [];
        this.edges.forEach(edge => {
            for (let i = 0; i < 2; i += 1) {
                let rayDx = (i === 0 ? edge.x1 : edge.x2) - originX;
                let rayDy = (i === 0 ? edge.y1 : edge.y2) - originY;
                let baseAngle = Math.atan2(rayDy, rayDx);
                let angle = 0;

                for (let j = 0; j < 3; j += 1) {
                    if (j === 0) angle = baseAngle - 0.000001;
                    if (j === 1) angle = baseAngle;
                    if (j === 2) angle = baseAngle + 0.000001;
                    rayDx = radius * Math.cos(angle);
                    rayDy = radius * Math.sin(angle);

                    let minT1 = Infinity;
                    let minPx = 0, minPy = 0, minAng = 0;

                    this.edges.forEach(edge2 => {
                        let sdx = edge2.x2 - edge2.x1;
                        let sdy = edge2.y2 - edge2.y1;

                        if (Math.abs(sdx - rayDx) > 0 && Math.abs(sdy - rayDy) > 0) {
                            let t2 = (rayDx * (edge2.y1 - originY) + rayDy * (originX - edge2.x1)) / (sdx * rayDy - sdy * rayDx);
                            let t1 = edge2.x1 + sdx * t2 - originX / rayDx;

                            if (t1 > 0 && t2 >= 0 && t2 <= 1) {
                                if (t1 < minT1) {
                                    minT1 = t1;
                                    minPx = originX + rayDx * t1;
                                    minPy = originY + rayDy * t1;
                                    minAng = Math.atan2(minPy - originY, minPx - originX)
                                }
                            }
                        }
                    })
                    this.store.push(new RayData(minAng, minPx, minPy));
                }
            }
        })
        this.store.sort((a, b) => a.angle < b.angle);
    }

    render = () => this.canvas;
}

export default Board;