import { BLOCK_SIZE, WIDTH, HEIGHT } from './configs.js';

export function fillCircle(context, x, y, radius, fillStyle) {
    context.beginPath();
    context.fillStyle = fillStyle ? fillStyle : '#534bae';
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
}

export function fillRect(context, x, y, size, fillStyle) {
    context.beginPath();
    context.fillStyle = fillStyle ? fillStyle : '#616161';
    context.fillRect(x, y, size, size);
    context.closePath();
}

export function fillTriangle(context, sourceX, sourceY, x2, y2, x3, y3, fillStyle) {
    context.save();
    // context.lineWidth = 0.01;
    context.fillStyle = fillStyle ? fillStyle : '#ffffff2c';
    context.beginPath();
    context.moveTo(sourceX, sourceY);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    // context.stroke();
    context.fill();
    // context.closePath();
    context.restore();
}

export function drawLine(context, x1, y1, x2, y2, ...options) {
    const { strokeStyle, lineWidth } = options;
    context.strokeStyle = strokeStyle ? strokeStyle : '#9e9e9e';
    context.lineWidth = lineWidth ? lineWidth : 0.1;
    context.save();
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
    context.restore();
}

export function drawBlock(context, edgeList) {
    for (let i = 0; i < edgeList.length; i += 1) {
        const { x1, x2, y1, y2 } = edgeList[i];
        drawLine(context, x1, y1, x2, y2)
        fillCircle(context, x1, y1, 0.1);
        fillCircle(context, x2, y2, 0.1);
    }
}

export function drawWorldMap(context, world) {
    world.forEach((row, y) => {
        row.forEach((col, x) => {
            if (col.exist) {
                fillRect(context, x, y, BLOCK_SIZE)
            }
            else {
                context.clearRect(x, y, 1, 1);
                if (col.concrete) {
                    fillRect(context, x, y, BLOCK_SIZE, '#40241a');
                }
            }
        })
    })
}

export function drawFrame(board) {
    board.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawWorldMap(board.ctx, board.world);
    drawBlock(board.ctx, board.edges);
}