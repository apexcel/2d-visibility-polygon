import { ROWS, COLS } from './configs.js';
import Edge from './Edge.js';

const LEFT = 0;
const UP = 1;
const DOWN = 2;
const RIGHT = 3;

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

function extractEdges() {
    this.edges = [];
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
                if (!current.edgeExist[RIGHT]){
                    coor = [x + 1, x + 1, y, y + 1];
                    check(current, this.edges, right, up, RIGHT, coor);
                }
            }
        }
    }
    console.log(this.edges)
}
export default extractEdges;