var globalScaleValue = 1;
var globalStrokeWidth = 1;
var vcanvas = /** @class */ (function () {
    var _triggers = {};

    function vcanvas(params) {
        this.parentId = params.parentId;
        this.canvasId = 'canvas-1';
        this.wrapperId = 'wrapper-' + this.canvasId;
        this.canvas = null;
        this.data = params.data ? params.data : null;
        this.background = params.background ? params.background : '';

        this.shapes = [];
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.selectedShape = null;

        this.init();
    }

    vcanvas.prototype.init = function () {
        this.rendHtml();

        this.canvas = new fabric.Canvas(this.canvasId, {
            selection: false,
            controlsAboveOverlay: false
        });

        fabric.Circle.prototype.originX = fabric.Circle.prototype.originY = 'center';
        fabric.Line.prototype.originX = fabric.Line.prototype.originY = 'center';

        this.setBackground();

        //setup event
        this.resizeCanvasWithWindow();
        this.zoomWithMousewheel();
        this.initMouseEvent();

    }

    vcanvas.prototype.update = function (params) {
        var id = params.id;
        var color = params.color ? params.color : '#' + getRandomColor();
        var points = params.points ? params.points : [];

        if (!id) return;
        if (points.length <= 0) return;

        if (this.imageHeight <= 0 && this.imageWidth <= 0) {
            var mother = this;
            setTimeout(function () {
                mother.update(params);
            }, 200);
        } else {
            var shape = this.shapes.find(x => x.id == id);
            if (shape) {
                shape.remove();
                this.shapes.splice(shape, 1);

                this.draw(params);
            }
        }
    }

    vcanvas.prototype.create = function (params) {
        if (this.imageHeight <= 0 && this.imageWidth <= 0) {
            var mother = this;
            setTimeout(function () {
                mother.create(params);
            }, 100);
        } else {
            this.draw(params);
        }
    }
    vcanvas.prototype.draw = function (params) {
        var a = this.randomName();
        var name = params.name ? params.name : a.name;
        var id = params.id ? params.id : a.index;
        var points = params.points ? params.points : [];
        var color = params.color ? params.color : '#' + getRandomColor();

        if (points.length > 3) {
            var newShape = new Shape({
                id: id,
                name: name,
                canvas: this.canvas,
                color: color,
                points: this.proccessPoint({
                    canvas: this.canvas,
                    shapeName: name,
                    color: color,
                    points: points,
                    parentId: id
                })
            });

            newShape.Draw({
                scaleFactor: globalScaleValue,
                strokeWidth: globalStrokeWidth
            });

            this.shapes.push(newShape);
            this.triggerHandler("CanvasModified", {
                event: `created`,
                source: newShape
            });

        }
    }
    vcanvas.prototype.proccessPoint = function (params) {
        var result = [];
        var mother = this;
        params.points.forEach(p => {
            var newPoint = new Point({
                index: p.index,
                name: `P-${p.index}`,
                parentId: params.parentId,
                top: p.top * mother.imageHeight,
                left: p.left * mother.imageHeight,
                fill: params.color,
                stroke: params.color,
                canvas: params.canvas,
                readOnly: params.readOnly ? params.readOnly : false,
                viewOnly: params.viewOnly ? params.viewOnly : false
            });

            result.push(newPoint);
        });

        return result;
    }

    vcanvas.prototype.initMouseEvent = function () {
        var canvas = this.canvas;
        var mother = this;
        var panning = false;
        var isMouseDown = false;

        fabric.Canvas.prototype.getItem = function (name, parentId) {
            var object = null,
                objects = this.getObjects();
            var os = [];
            for (var i = 0, len = this.size(); i < len; i++) {
                if (parentId) {
                    if (name) {
                        if (objects[i].name && objects[i].name === name && objects[i].parentId === parentId) {
                            object = objects[i];
                            break;
                        }
                    } else {
                        if (objects[i].parentId === parentId) {
                            os.push(objects[i]);
                        }
                    }
                } else {
                    if (objects[i].name && objects[i].name === name) {
                        object = objects[i];
                        break;
                    }
                }
            }
            return (name) ? object : os;
        };


        this.canvas.on({
            'mouse:down': function (o) {
                var pointer = canvas.getPointer(o.e);
                x0 = pointer.x;
                y0 = pointer.y;
                if (o.e.type == "touchstart") {
                    startX = o.e.touches[0].pageX;
                    startY = o.e.touches[0].pageY;
                }

                if ((o.e.type === 'touchmove') && (o.e.touches.length > 1)) {
                    return;
                }

                var obj = o.target;
                if (!obj || obj.get('type') === "image") {
                    panning = true;
                    mother.resetHightLight();
                } else {
                    mother.selectedShape = mother.shapes.find(x => x.id == obj.get('parentId'));
                    mother.selectedShape.hightLight();
                    mother.triggerHandler('CanvasModified', {
                        event: 'clicked',
                        source: mother.selectedShape
                    });
                }
            },
            'mouse:move': function (o) {
                if (panning && o && o.e) {
                    if (o.e.type !== "touchmove") {
                        var delta = new fabric.Point(o.e.movementX, o.e.movementY);
                        canvas.relativePan(delta);
                    } else {
                        var delta = new fabric.Point((o.e.touches[0].pageX - startX) / 10, (o.e.touches[0].pageY - startY) / 10);
                        canvas.relativePan(delta);
                    }
                }
            },
            'mouse:over': function (e) {
                var obj = e.target;
                if (obj) {
                    if (obj.get('type') == "image") {
                        obj.set({
                            hoverCursor: "default"
                        });
                    }
                }
            },
            'mouse:out': function (e) {},
            'mouse:up': function (o) {
                if (mother.selectedShape && mother.selectedShape.isMoving) {
                    mother.selectedShape.isMoving = false;
                    mother.selectedShape.hightLight();

                    mother.triggerHandler('CanvasModified', {
                        event: 'moved',
                        source: mother.selectedShape
                    });
                }
                panning = false;
                isMouseDown = false;
            },
            'object:moving': function (e) {
                var p = e.target;
                var obj = e.target;
                var scaleValue = p.scaleX;
                var pointer = canvas.getPointer(e.e);
                var allObject = canvas.getObjects();
                console.log(globalStrokeWidth);

                if (p.name.split('-')[0] == "i" || p.name.split('-')[0] == "lb") {
                    for (var i = 0; i < mother.shapes.length; i++) {
                        if (p.parentId == mother.shapes[i].id) {
                            mother.selectedShape = mother.shapes[i];
                            mother.selectedShape.isMoving = true;
                            mother.shapes[i].Move({
                                offsetX: e.e.movementX * globalStrokeWidth,
                                offsetY: e.e.movementY * globalStrokeWidth,
                                scaleFactor: globalScaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                            break;
                        }
                    }
                } else {
                    for (var i = 0; i < mother.shapes.length; i++) {
                        if (p.parentId == mother.shapes[i].id) {
                            mother.selectedShape = mother.shapes[i];
                            mother.selectedShape.isMoving = true;
                            mother.shapes[i].Move({
                                point: p,
                                offsetX: e.e.movementX,
                                offsetY: e.e.movementY,
                                scaleFactor: scaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                            break;
                        }
                    }
                }
                mother.canvas.renderAll();
            }

        })
    }

    vcanvas.prototype.resetHightLight = function () {
        var allObject = this.canvas.getObjects();
        allObject.forEach(obj => {
            obj.set('strokeWidth', globalStrokeWidth);
            if (obj.get('type') == 'circle') {
                obj.set({
                    'radius': 5
                });
            }
        });
    }

    vcanvas.prototype.zoomWithMousewheel = function () {
        var canvasEle = this.canvas.wrapperEl;
        var canvas = this.canvas;

        canvasEle.onwheel = function (e) {
            e.preventDefault();
            var delta = e.wheelDelta / 500;
            var pointer = canvas.getPointer(e.e);
            var scaleFactor = 0;
            var objects = canvas.getObjects();
            if (delta > 0) {
                scaleFactor = canvas.getZoom() * 1.1;
                canvas.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), scaleFactor);
                for (var i in objects) {
                    if (objects[i].get('type') == 'image' || objects[i].get('type') == "path") {
                        if (objects[i].get('type') == 'image') {
                            console.log(objects[i]);
                        }
                        continue;
                    };

                    if (objects[i].get('type') == "line") {
                        // objects[i].strokeWidth /= 1.1;
                        // globalStrokeWidth = objects[i].strokeWidth;
                        continue;
                    }

                    objects[i].scaleX /= 1.1;
                    objects[i].scaleY /= 1.1;
                    globalScaleValue = objects[i].scaleX;
                    objects[i].setCoords();

                }
            }
            if (delta < 0) {
                scaleFactor = canvas.getZoom() / 1.1;
                canvas.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), scaleFactor);
                for (var i in objects) {

                    if (objects[i].get('type') == 'image' || objects[i].get('type') == "path") {

                        if (objects[i].get('type') == 'image') {
                            console.log(objects[i]);
                        }

                        continue;
                    };
                    if (objects[i].get('type') == "line") {
                        // objects[i].strokeWidth *= 1.1;
                        // globalStrokeWidth = objects[i].strokeWidth;
                        continue;
                    }
                    objects[i].scaleX *= 1.1;
                    objects[i].scaleY *= 1.1;
                    globalScaleValue = objects[i].scaleX;
                    objects[i].setCoords();

                }
            }
        }
    }

    vcanvas.prototype.resizeCanvasWithWindow = function () {
        var parentWidth = document.getElementById(this.parentId).offsetWidth;
        var parentHeight = document.getElementById(this.parentId).offsetHeight;
        var canvas = this.canvas;

        if (canvas.width != parentWidth) {
            var scaleMultiplier = parentWidth / canvas.width;
            var objects = canvas.getObjects();
            originWidth = canvas.getWidth()
            originHeight = canvas.getHeight()
            canvas.setWidth(canvas.getWidth() * scaleMultiplier);
            canvas.setHeight(canvas.getHeight() * scaleMultiplier);
            canvas.renderAll();
            canvas.calcOffset();
            this.currentWidth = canvas.getWidth();
            this.currentHeight = canvas.getHeight();
            // console.log("window scale ratio: " + scaleMultiplier, "Origin width: " + originWidth, "Origin height:" + originHeight, "new width:" + (originWidth * scaleMultiplier), "new height:" + (originHeight * scaleMultiplier))
        }

        window.onresize = function (event) {
            if (canvas.width != parentWidth) {
                var scaleMultiplier = parentWidth / canvas.width;
                var objects = canvas.getObjects();
                originWidth = canvas.getWidth()
                originHeight = canvas.getHeight()
                canvas.setWidth(canvas.getWidth() * scaleMultiplier);
                canvas.setHeight(canvas.getHeight() * scaleMultiplier);
                canvas.renderAll();
                canvas.calcOffset();
                this.currentWidth = canvas.getWidth();
                this.currentHeight = canvas.getHeight();
                // console.log("window scale ratio: " + scaleMultiplier, "Origin width: " + originWidth, "Origin height:" + originHeight, "new width:" + (originWidth * scaleMultiplier), "new height:" + (originHeight * scaleMultiplier))
            }
        };
        // var img = mother.getItem('background', null);
        // if (img) {
        //     var scaleFactor = mother.currentWidth / img.width;
        //     canvas.setZoom(scaleFactor / 1.1);
        // }
    }

    vcanvas.prototype.setBackground = function () {
        var mother = this;
        if (this.background) {
            fabric.Image.fromURL(this.background, function (img) {
                img.selectable = false;
                img.set({
                    name: 'bgr' + mother.canvasId,
                    left: 0,
                    top: 0
                });
                var cHeight = document.getElementById(mother.canvasId).offsetHeight;
                img.scaleToHeight(cHeight);
                mother.canvas.add(img);
                mother.canvas.sendToBack(img);
                mother.canvas.renderAll();

                mother.imageHeight = cHeight;
                mother.imageWidth = img.width;

                mother.drawAllShapes();
            })
        }
    }

    vcanvas.prototype.drawAllShapes = function () {
        if (this.data) {
            this.data.forEach(obj => {
                this.draw({
                    name: obj.name,
                    points: obj.points,
                    color: obj.color,
                    id: obj.id
                });
            });
        }
    }

    vcanvas.prototype.rendHtml = function () {
        var s = `<div id="${this.wrapperId}"><canvas id="${this.canvasId}"></canvas></div>`;
        var parent = document.getElementById(this.parentId);
        parent.innerHTML = s;
    }

    vcanvas.prototype.on = function (event, callback) {
        if (!_triggers[event])
            _triggers[event] = [];
        _triggers[event].push(callback);
    }

    vcanvas.prototype.triggerHandler = function (event, params) {
        if (_triggers[event]) {
            for (i in _triggers[event])
                _triggers[event][i](params);
        }
    }

    vcanvas.prototype.randomName = function () {
        var lstName = [];
        var name;
        var isExsit = true;
        var i = 1;
        var indexs = [];
        var index = 1;
        this.shapes.forEach(function (o) {
            indexs.push(o.id);
            lstName.push(o.name);
        });

        while (isExsit) {
            if (indexs.indexOf(index) == -1) {
                name = "shape-" + i;
                if (lstName.indexOf(name) == -1) {
                    isExsit = false;
                } else {
                    ++i;
                }
            } else {
                index++;
            }

        }
        return {
            name: name,
            index: index
        };
    };

    vcanvas.prototype.toJson = function () {
        var temp = Object.assign({}, this);
        var ExportObject = {};
        var image = this.background;
        var mother = this;

        ExportObject.backgroundUrl = this.backgroundUrl;
        ExportObject.shapes = [];

        this.shapes.forEach(function (shape) {
            var ShapeExportObj = {};

            ShapeExportObj.name = shape.name;
            ShapeExportObj.points = [];
            var count = 0;
            shape.points.forEach(function (point) {
                if (!point.middlePoint) {
                    ShapeExportObj.points.push({
                        index: count,
                        name: point.name,
                        left: point.left < 0 ? 0 : parseFloat(point.left / image.width),
                        top: point.top < 0 ? 0 : parseFloat(point.top / image.height),
                    });
                    count++;
                }
            });
            ExportObject.shapes.push(ShapeExportObj);
        });
        var js = JSON.stringify(ExportObject);
        return js;
    }
    return vcanvas;
}());

var Point = /** @class */ (function () {
    function Point(params) {
        this.index = params.index ? params.index : 0;
        this.name = params.name ? params.name : null;
        this.parentId = params.parentId ? params.parentId : null;
        this.left = params.left ? params.left : 0;
        this.top = params.top ? params.top : 0;
        this.fill = params.fill ? params.fill : null;
        this.stroke = params.stroke ? params.stroke : null;
        this.lockMovementX = params.lockMovementX ? params.lockMovementX : false;
        this.lockMovementY = params.lockMovementY ? params.lockMovementY : false;
        this.canvas = params.canvas ? params.canvas : null;
        this.readOnly = params.readOnly ? params.readOnly : false;
        this.viewOnly = params.viewOnly ? params.viewOnly : false;
        this.XRatio = params.XRatio; //ty le cua diem nam giua so vs canh tren truc OX
        this.YRatio = params.YRatio; //ty le cua diem nam giua so vs canh tren truc OY
    }

    Point.prototype.Draw = function (params) {
        var c = this.canvas;
        var scaleFactor = params.scaleFactor ? params.scaleFactor : null;
        this.readOnly = params.readOnly ? params.readOnly : false;
        this.viewOnly = params.viewOnly ? params.viewOnly : false;

        var p = new fabric.Circle({
            left: this.left,
            top: this.top,
            fill: this.fill,
            radius: 5,
            stroke: 'black',
            strokeWidth: 1,
            name: this.name,
            parentId: this.parentId,
            XRatio: this.XRatio,
            YRatio: this.YRatio,
            hoverCursor: "pointer",
            selectable: !this.readOnly,
        });
        if (scaleFactor) {
            p.scaleX = scaleFactor;
            p.scaleY = scaleFactor;
        }
        this.canvas = c;
        if (this.lockMovementX)
            p.set({
                lockMovementX: true
            });
        if (this.lockMovementY)
            p.set({
                lockMovementY: true
            });
        p.hasControls = p.hasBorders = false;
        c.add(p);
    };
    return Point;
}());
var Shape = /** @class */ (function () {
    function Shape(params) {
        this.id = params.id ? params.id : null;
        this.name = params.name ? params.name : null;
        this.points = params.points ? params.points : [];
        this.color = params.color ? params.color : '#' + getRandomColor();
        this.isMoving = params.isMoving ? params.isMoving : false;
        this.canvas = params.canvas ? params.canvas : null;
        this.readOnly = params.readOnly ? params.readOnly : false;
        this.viewOnly = params.viewOnly ? params.viewOnly : false;
        this.lbX = 0;
        this.lbY = 0;
    };
    Shape.prototype.DrawLabel = function (params) {
        var data = params.data ? params.data : null;
        var scaleFactor = params.scaleFactor ? params.scaleFactor : null;

        if (!this.lbX && !this.lbY) {
            for (var i = 0; i < this.points.length; i++) {
                if (this.points[i].name == "P-0") {
                    this.lbX = this.points[i].left + 5;
                    this.lbY = this.points[i].top - 40;
                    break;
                }
            }
        }
        if (!data)
            data = String(this.id);

        var label = new fabric.IText(data, {
            name: "lb-" + this.name,
            parentId: this.id,
            left: this.lbX,
            top: this.lbY,
            fontSize: 25,
            fontFamily: "calibri",
            fill: this.color,
            strokeWidth: 0.5,
            hasRotatingPoint: false,
            centerTransform: true,
            selectable: !this.readOnly,
            viewOnly: this.viewOnly
        });
        if (scaleFactor) {
            label.scaleX = scaleFactor;
            label.scaleY = scaleFactor;
        }
        label.hasControls = label.hasBorders = false;
        this.canvas.add(label);
        // console.log(label.get('type'));
    };

    Shape.prototype.Draw = function (params) {
        var scaleFactor = params.scaleFactor ? params.scaleFactor : null;
        var strokeWidth = params.strokeWidth ? params.strokeWidth : 2;
        var dlines = {};
        var data = '';

        this.DrawLabel({
            data: data,
            scaleFactor: scaleFactor
        });

        for (var i = 0; i < this.points.length; i++) {
            var line;

            if (i !== (this.points.length - 1)) {
                line = new fabric.Line([
                    this.points[i].left,
                    this.points[i].top,
                    this.points[i + 1].left,
                    this.points[i + 1].top
                ], {
                    name: "line" + i,
                    parentId: this.id,
                    fill: this.color,
                    stroke: this.color,
                    selectable: false,
                    hasControls: false,
                    hasBorders: false,
                    hasRotatingPoint: false,
                    hoverCursor: this.hoverCursor,
                    perPixelTargetFind: true
                });
            } else {
                line = new fabric.Line([this.points[i].left, this.points[i].top,
                    this.points[0].left, this.points[0].top
                ], {
                    name: "line" + i,
                    parentId: this.id,
                    fill: this.color,
                    stroke: this.color,
                    selectable: false,
                    hasControls: false,
                    hasBorders: false,
                    hasRotatingPoint: false,
                    hoverCursor: this.hoverCursor,
                    perPixelTargetFind: true
                });
            }
            if (globalStrokeWidth) {
                line.strokeWidth = globalStrokeWidth;
            } else {
                line.strokeWidth = 3;
            }
            dlines[line.name] = line;
            this.canvas.add(line);
        }
        this.FillInside();
        var arrLine = [];
        Object.keys(dlines).forEach(function (key) {
            var value = dlines[key].name;
            arrLine.push(value);
        });
        this.lines = arrLine;


        for (var i = 0; i < this.points.length; i++) {
            this.points[i].hoverCursor = this.hoverCursor;
            this.points[i].fill = this.color;
            this.points[i].Draw({
                canvas: this.canvas,
                scaleFactor: scaleFactor,
                readOnly: this.readOnly,
                viewOnly: this.viewOnly
            });
        }



    };

    Shape.prototype.hightLight = function () {
        var allObject = this.canvas.getObjects();
        allObject.forEach(obj => {
            obj.set('strokeWidth', globalStrokeWidth);
            if (obj.get('type') == 'circle') {
                obj.set({
                    'radius': 5
                });
            }
        });

        var objectsOfShape = allObject.filter(x => x.get('parentId') == this.id);

        objectsOfShape.forEach(obj => {
            var name = obj.get('name');
            if (name.split('-')[0] != 'i' && name.split('-')[0] != 'P') {
                obj.set('strokeWidth', 5);
            } else if (name.split('-')[0] == 'P') {
                obj.set({
                    'radius': 10
                });
            }
        });
    }

    Shape.prototype.Move = function (params) {
        var offsetX = params.offsetX ? params.offsetX : 0;
        var offsetY = params.offsetY ? params.offsetY : 0;

        var point = params.point ? params.point : null;
        var scaleFactor = params.scaleFactor ? params.scaleFactor : null;
        var strokeWidth = params.strokeWidth ? params.strokeWidth : null;

        if (point) {
            var originPoint = {
                left: 0,
                top: 0
            };
            for (var i = 0; i < this.points.length; i++) {
                if (point.name === this.points[i].name) {
                    originPoint.left = this.points[i].left;
                    originPoint.top = this.points[i].top;
                    this.points[i].left = point.left;
                    this.points[i].top = point.top;
                    break;
                }
            }
            this.lbX = this.points[0].left + 5;
            this.lbY = this.points[0].top - 40;
        } else {
            this.GetNewCoodr(offsetX, offsetY);
        }

        if (this.color == null) {
            this.color = '#' + getRandomColor();
        }

        this.remove();
        this.Draw({
            scaleFactor: scaleFactor,
            strokeWidth: strokeWidth
        });

    }

    Shape.prototype.FillInside = function () {
        var pathDirection = 'M';
        this.points.forEach(function (p) {
            pathDirection += ' ' + p.left + ' ' + p.top + ' L';
        });
        pathDirection += ' z';
        var path = new fabric.Path(pathDirection);
        path.set({
            name: 'i-' + this.name,
            parentId: this.id,
            opacity: 0.01,
            hasControls: false,
            hasBorders: false,
            hasRotatingPoint: false,
            selectable: !this.readOnly,
            viewOnly: this.viewOnly
        });

        path.set({
            perPixelTargetFind: true
        });
        this.canvas.add(path);
    };

    Shape.prototype.remove = function () {
        var objs = this.canvas.getItem('', this.id);
        for (var i = 0; i < objs.length; i++) {
            this.canvas.remove(objs[i]);
        }
    };

    Shape.prototype.GetPoint = function (name) {
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].name == name) {
                return this.points[i];
            }
        }
    }

    Shape.prototype.GetNewCoodr = function (a, b) { //tinh lai toa do khi di chuyen
        for (var i = 0; i < this.points.length; ++i) {
            this.points[i].left += a;
            this.points[i].top += b;
        }
        this.lbX = this.points[0].left + 5;
        this.lbY = this.points[0].top - 40;
    };
    return Shape;
}());


var getRandomInt = function (start, end) {
    return Math.floor(Math.random() * end) + start;
}
var getRandomColor = function () {
    return (pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2));
}
var pad = function (str, length) {
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}
var getRandomNum = function (min, max) {
    return Math.random() * (max - min) + min;
}