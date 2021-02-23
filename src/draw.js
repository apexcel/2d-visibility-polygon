export function circle(context, x, y, radius, color) {
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

export function line(context, x1, y1, x2, y2, options) {
    const { strokeStyle, lineWidth } = options;
    context.strokeStyle = strokeStyle ? strokeStyle : 'gray';
    context.lineWidth = lineWidth ? lineWidth : 1;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}