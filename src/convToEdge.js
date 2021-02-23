import { Point, Edge } from './types.js'

const LEFT = 0;
const UP = 1;
const DOWN = 2;
const RIGHT = 3;

const findout = (edgeList, x, y, current, adjcentTarget, extendTarget, direction) => {
    if (!current.edgeExist[direction]) {
        if (!adjcentTarget.exist) {
            if (extendTarget.exist && extendTarget.edgeExist[direction]) {
                const endPoint = direction === LEFT || RIGHT ? 'y2' : 'x2';
                edgeList[extendTarget.edgeIds[direction]][endPoint] += 1;
                current.edgeIds[direction] = extendTarget[direction];
                current.edgeExist[direction] = true;
            }
            else {
                const edgeId = edgeList.length;
                let edge;
                if (direction === 0) {
                    edge = Edge(x, x, y, y + 1);
                }
                else if (direction === 1) {
                    edge = Edge(x, x + 1, y, y + 1);
                }
                else if (direction === 2) {
                    edge = Edge(x, x + 1, y + 1, y + 1);
                }
                else {
                    edge = Edge(x + 1, x + 1, y, y + 1);
                }
                edgeList.push(edge);
                current.edgeIds[direction] = edgeId;
                current.edgeExist[direction] = true;
            }
        }
    }
};

const convToEdge = (tableMap, rows, cols) => {
    const edgeList = [];
    for (let y = 1; y < rows - 1; y += 1) {
        for (let x = 1; x < cols - 1; x += 1) {
            const current = tableMap[y][x];
            const left = tableMap[y][x - 1];
            const up = tableMap[y - 1][x];
            const down = tableMap[y + 1][x];
            const right = tableMap[y][x + 1];

            if (current.exist) {
                current.edgeIds = [-1, -1, -1, -1];
                current.edgeExist = [false, false, false, false];
                findout(edgeList, x, y, current, left, LEFT);
                findout(edgeList, x, y, current, up, UP);
                findout(edgeList, x, y, current, down, DOWN);
                findout(edgeList, x, y, current, right, RIGHT);
            }
        }
    }
    return edgeList
}

export default convToEdge;