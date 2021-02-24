import { BLOCK_SIZE, WIDTH, HEIGHT, ROWS, COLS, WALLS } from './configs.js';
import Edge from './Edge.js'
import Ray from './Ray.js'
import * as draw from './draw.js';

const LEFT = 0;
const UP = 1;
const DOWN = 2;
const RIGHT = 3;
let lightsOn = false;

const updateLight = (e, board) => {
    const targetX = e.offsetX, targetY = e.offsetY;
    const x = targetX / BLOCK_SIZE, y = targetY / BLOCK_SIZE;
    if (lightsOn) {
        board.calcVisibility(x, y, 1000);
        if (board.store.length > 1) {
            e.preventDefault();
            draw.drawFrame(board);
            for (let i = 0; i < board.store.length - 1; i += 1) {
                draw.fillTriangle(board.ctx, x, y, board.store[i].x, board.store[i].y, board.store[i + 1].x, board.store[i + 1].y)
            }
            draw.fillTriangle(board.ctx, x, y, board.store[board.store.length - 1].x, board.store[board.store.length - 1].y, board.store[0].x, board.store[0].y)
        }
    }
}

const clickHandler = (e, board) => {
    const targetX = e.offsetX, targetY = e.offsetY;
    const x = Math.floor(targetX / BLOCK_SIZE), y = Math.floor(targetY / BLOCK_SIZE);

    if (e.button === 0 && !board.world[y][x].concrete) {
        board.world[y][x].exist = !board.world[y][x].exist;
        board.extractEdges();
        draw.drawFrame(board);
    }
    if (e.button === 2) {
        if (lightsOn) {
            draw.drawFrame(board);
        }
        lightsOn = !lightsOn;
    }
}

class Board {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.oncontextmenu = () => false;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.canvas.width = WIDTH;
        this.ctx.canvas.height = HEIGHT;
        this.ctx.canvas.style.background = '#1b1b1b';
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

        this.init();
    }

    init = () => {
        this.world = Array.from(Array(ROWS), () => Array(COLS));
        for (let y = 0; y < ROWS; y += 1) {
            for (let x = 0; x < COLS; x += 1) {
                this.world[y][x] = {
                    exist: false,
                    edgeExist: [false, false, false, false],
                    edgeIds: [-1, -1, -1, -1],
                };

                if (x === 0 || y === 0 || x === COLS - 1 || y === ROWS - 1) {
                    this.world[y][x] = {
                        exist: false,
                        concrete: true,
                    }
                }
            }
        }
        this.store = [];
        this.edges = [...WALLS];
        this.canvas.addEventListener('mousedown', e => clickHandler(e, this));
        this.canvas.addEventListener('mousemove', e => updateLight(e, this));
        draw.drawFrame(this);
    }

    extractEdges = () => {
        this.edges = [...WALLS];
        const check = (current, edges, adj, ext, dir, coor) => {
            if (!adj.exist) {
                if (ext.exist && ext.edgeExist[dir]) {
                    const endPoint = (dir === LEFT || dir === RIGHT) ? 'y2' : 'x2';
                    edges[ext.edgeIds[dir]][endPoint] += 1;
                    current.edgeIds[dir] = ext.edgeIds[dir];
                }
                else {
                    const edge = new Edge(...coor);
                    const edgeId = edges.length;
                    edges.push(edge);
                    current.edgeIds[dir] = edgeId;
                }
                current.edgeExist[dir] = true;
            }
        };

        for (let y = 1; y < ROWS - 1; y += 1) {
            for (let x = 1; x < COLS - 1; x += 1) {
                const current = this.world[y][x];
                const left = this.world[y][x - 1];
                const up = this.world[y - 1][x];
                const down = this.world[y + 1][x];
                const right = this.world[y][x + 1];

                if (current.exist) {
                    current.edgeIds = [-1, -1, -1, -1];
                    current.edgeExist = [false, false, false, false];
                    let coor;
                    if (!current.edgeExist[LEFT]) {
                        coor = [x, x, y, y + 1];
                        check(current, this.edges, left, up, LEFT, coor);
                    }
                    if (!current.edgeExist[UP]) {
                        coor = [x, x + 1, y, y];
                        check(current, this.edges, up, left, UP, coor);
                    }
                    if (!current.edgeExist[DOWN]) {
                        coor = [x, x + 1, y + 1, y + 1];
                        check(current, this.edges, down, left, DOWN, coor);
                    }
                    if (!current.edgeExist[RIGHT]) {
                        coor = [x + 1, x + 1, y, y + 1];
                        check(current, this.edges, right, up, RIGHT, coor);
                    }
                }
            }
        }
    }

    calcVisibility = (sourceX, sourceY, radius) => {
        this.store = [];
        this.edges.forEach(edge => {
            for (let i = 0; i < 2; i += 1) {
                let rayDx = (i === 0 ? edge.x1 : edge.x2) - sourceX;
                let rayDy = (i === 0 ? edge.y1 : edge.y2) - sourceY;
                let baseAngle = Math.atan2(rayDy, rayDx);
                let angle = 0;

                for (let j = 0; j < 3; j += 1) {
                    if (j === 0) angle = baseAngle - 0.0001;
                    if (j === 1) angle = baseAngle;
                    if (j === 2) angle = baseAngle + 0.0001;
                    rayDx = radius * Math.cos(angle);
                    rayDy = radius * Math.sin(angle);

                    let minT1 = Infinity;
                    let minPx = 0, minPy = 0, minAng = 0;
                    let isValid = false;

                    this.edges.forEach(edge2 => {
                        let sdx = edge2.x2 - edge2.x1;
                        let sdy = edge2.y2 - edge2.y1;

                        if (Math.abs(sdx - rayDx) > 0 && Math.abs(sdy - rayDy) > 0) {
                            let t2 = (rayDx * (edge2.y1 - sourceY) + (rayDy * (sourceX - edge2.x1))) / (sdx * rayDy - sdy * rayDx);
                            let t1 = (edge2.x1 + sdx * t2 - sourceX) / rayDx;

                            if (t1 > 0 && t2 >= 0 && t2 <= 1) {
                                if (t1 < minT1) {
                                    minT1 = t1;
                                    minPx = sourceX + rayDx * t1;
                                    minPy = sourceY + rayDy * t1;
                                    minAng = Math.atan2(minPy - sourceY, minPx - sourceX)
                                    isValid = true;
                                }
                            }
                        }
                    })
                    if (isValid) {
                        this.store.push(new Ray(minAng, minPx, minPy));
                    }
                }
            }
        })
        this.store.sort((a, b) => a.angle - b.angle);
    }

    render = () => this.canvas;
}

export default Board;