export const Point = (x, y) => ({
    x, y
})

export const Edge = (x1, x2, y1, y2) => ({
    edgeBegin: Point(x1, y1),
    edgeEnd: Point(x2, y2)
});


