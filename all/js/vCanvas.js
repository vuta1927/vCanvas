var vCanvas = /** @class */ (function () {
    function vCanvas(point) {
        this.point = point;
    }
    return vCanvas;
}());
var Point = /** @class */ (function () {
    function Point(name, parent, left, top, radius, fill, strokeWidth, stroke, line1, line2, lockMovementX, lockMovementY) {
        this.lockMovementX = false;
        this.lockMovementY = false;
        this.name = name;
        this.parent = parent;
        this.left = left;
        this.top = top;
        this.radius = radius;
        this.fill = fill;
        this.strokeWidth = strokeWidth;
        this.stroke = stroke;
        this.line1 = line1;
        this.line2 = line2;
        this.lockMovementX = lockMovementX;
        this.lockMovementY = lockMovementY;
    }
    Point.prototype.Draw = function (lines) {
        var p = new fabric.Circle({
            left: this.left,
            top: this.top,
            fill: this.fill,
            radius: this.radius,
            strokeWidth: this.strokeWidth,
            stroke: this.name === "A" ? "black" : this.stroke,
            name: this.name,
            parent: this.parent
        });
        if (this.lockMovementX)
            p.set({ lockMovementX: true });
        if (this.lockMovementY)
            p.set({ lockMovementY: true });
        p.hasControls = p.hasBorders = false;
        p.line1 = lines[this.line1];
        p.line2 = lines[this.line2];
        canvas.add(p);
    };
    return Point;
}());
