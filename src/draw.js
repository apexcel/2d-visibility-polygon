import { BLOCK_SIZE, WIDTH, HEIGHT } from './configs.js';

function fillCircle(context, x, y, radius, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
}

export function fillRect(context, x, y, size, color) {
    context.beginPath();
    context.fillStyle = color ? color : 'blue';
    context.fillRect(x, y, size, size);
    context.closePath();
}

export function fillTriangle(context, x1, y1, x2, y2, x3, y3, fillStyle) {
    context.save();
    context.fillStyle = fillStyle ? fillStyle : 'white';
    // context.strokeStyle = 'white';
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    // context.stroke();
    context.fill();
    // context.closePath();
    context.restore();
}

export function drawLine(context, x1, y1, x2, y2, options) {
    const { strokeStyle, lineWidth } = options;
    context.strokeStyle = strokeStyle ? strokeStyle : 'gray';
    context.lineWidth = lineWidth ? lineWidth : 1;
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
        drawLine(context, x1, y1, x2, y2, {
            strokeStyle: 'wheat',
            lineWidth: 0.1,
        })
        fillCircle(context, x1, y1, 0.1, 'red');
        fillCircle(context, x2, y2, 0.1, 'red');
    }
}

export function drawWorldMap(context, world) {
    world.forEach((row, y) => {
        row.forEach((col, x) => {
            col.exist 
            ? fillRect(context, x, y, BLOCK_SIZE)
            : context.clearRect(x, y, 1, 1);
        })
    })
}

export function drawFrame(board) {
    board.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawWorldMap(board.ctx, board.world);
    drawBlock(board.ctx, board.edges);
}