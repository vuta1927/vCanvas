types = {
    Rect: 100,
    CalibRect: 101,
    TwoAreaRectH: 102,
    TwoAreaRectV: 103,
    Line: 200,
    HLine: 201,
    VLine: 202,
    Text: 300
};
typeColumns = {
    Text: 100,
    Number: 200,
    Combobox: 300,
    Checkbox: 400
};
ExtendOtions = [];
globalScaleValue = 1;
globalStrokeWidth = 3;
canvasCollection = [];
globalImageWidth = 1;
globalImageHeight = 1;
replaceValues = [];
colors = {
    Rect: '#ff00ff',
    Line: '#00ff00',
    VerticalLine: '#0066ff',
    HorizontalLine: '#ffff00',
    Text: '#23EAEA',
    TwoAreaRectH: '#ccff00',
    TwoAreaRectV: '#00ff7f'
};
(function () {
    function Create(params) {
        var properties = $.extend({
            json: null,
            parent: null,
            backgroundUrl: null,
            types: [],
            extColumns: [],
            maxShape: null,
            randomColor: false,
        }, params);
        var json = properties.json;
        var parentId = properties.parent;
        var backgroundUrl = properties.backgroundUrl;
        var types = properties.types;
        var extColumns = properties.extColumns;
        var maxShape = properties.maxShape;
        var randomColor = properties.randomColor;

        var newCanvas = new vcanvas({
            id: GenerateId(),
            types: types,
            parent: parentId,
            backgroundUrl: backgroundUrl,
            js: json,
            extColumns: extColumns,
            maxShape: maxShape,
            randomColor: randomColor
        });
        canvasCollection.push(newCanvas);
        return newCanvas;
    }

    function Add(json) {
        var Raw = JSON.parse(json);
        var parentId = Raw.parent;
        var backgroundUrl = Raw.backgroundUrl;
        var types = Raw.types;
        var extColumns = Raw.extColumns;
        var maxShape = Raw.maxShape;
        var randomColor = Raw.randomColor;
        var shapes = Raw.shapes;
        var newCanvas = new vcanvas({
            id: GenerateId(),
            types: types,
            parent: parentId,
            backgroundUrl: backgroundUrl,
            extColumns: extColumns,
            maxShape: maxShape,
            randomColor: randomColor,
            fromApi: true,
            RawShapeData: shapes
        });

        canvasCollection.push(newCanvas);
        return newCanvas;
    }

    function GenerateId() {
        var index = 0;
        canvasCollection.forEach(function (obj) {
            index++;
        });
        return `vcanvas-${index}`;
    };
    myCanvas = {
        Create: Create,
        GenerateId: GenerateId,
        Add: Add,
    }
})();
var extColumn = (function () {
    function extColumn(params) {
        var properties = $.extend({
            name: null,
            type: typeColumns.Text,
            data: null,
            width: 30
        }, params);
        this.name = properties.name;
        this.type = properties.type;
        this.data = properties.data;
        this.width = properties.width;
    }
    return extColumn;
}());
var vcanvas = /** @class */ (function () {
    var _triggers = {};

    function vcanvas(params) {
        var properties = $.extend({
            //these are the defaults
            id: null,
            parent: null,
            parentObject: null,
            types: [],
            backgroundUrl: null,
            shapes: [],
            isDrawing: false,
            isMouseDown: false,
            panning: false,
            AddPointMode: false,
            ActiveObject: null,
            units: 70,
            startX: 0,
            startY: 0,
            tempPoint: null,
            LineHovered: null,
            prevSelected: null,
            js: null,
            extColumns: [],
            currentWidth: null,
            currentHeight: null,
            maxShape: null,
            randomColor: null,
            fromApi: false,
            RawShapeData: []
        }, params);
        this.id = properties.id;
        this.parent = properties.parent; //id, ex: <div id='containner'>
        this.parentObject = properties.parentObject;
        this.types = properties.types;
        this.backgroundUrl = properties.backgroundUrl;
        this.shapes = properties.shapes;
        this.units = properties.units;
        this.startX = properties.startX;
        this.startY = properties.startY;
        this.tempPoint = properties.tempPoint;
        this.LineHovered = properties.LineHovered;
        this.ActiveObject = properties.ActiveObject;
        this.prevSelected = properties.prevSelected;
        this.js = properties.js;
        this.extColumns = properties.extColumns;
        this.currentHeight = properties.currentHeight;
        this.currentWidth = properties.currentWidth;
        this.maxShape = properties.maxShape;
        this.randomColor = properties.randomColor;
        this.fromApi = properties.fromApi;
        this.RawShapeData = properties.RawShapeData;
        this.init(this.js);
    }

    vcanvas.prototype.initId = function () {
        this.bgModalId = this.id + '-modal';
        this.txtImgUrlId = this.id + '-txtImgUrl';
        this.modalErrorId = this.id + '-modalError';
        this.btnChangeBackgroundSaveId = this.id + '-btnChangeBackgroundSave';
        this.btnAddRectId = this.id + '-btnAddRect';
        this.btnAddTwoAreaRectHId = this.id + '-btnAddTwoAreaRectH';
        this.btnAddTwoAreaRectVId = this.id + '-btnAddTwoAreaRectV';
        this.btnAddText = this.id + '-btnAddText';
        this.btnAddVerticalLineId = this.id + '-btnAddVerticalLine';
        this.btnAddHorizontalLineId = this.id + '-btnAddHorizontalLine';
        this.btnDrawLineId = this.id + '-btnDrawLine';
        this.btnZoomInId = this.id + '-btnZoomIn';
        this.btnZoomOutId = this.id + '-btnZoomOut';
        this.btnResetZoomId = this.id + '-btnResetZoom';
        this.btnAddBackgroundId = this.id + '-btnAddBackground';
        this.btnExportId = this.id + '-btnExport';
        this.lblNoteId = this.id + '-lblNote';
        this.txtNameId = this.id + '-txtName';
        this.txtDataId = this.id + '-txtData';
        this.wrapperId = this.id + '-wrapper';
        this.canvasId = this.id + '-canvas';
        this.tableId = this.id + '-table';
        this.btnNewColumnId = this.id + '-btnNewColumn';
        this.tableWrapperId = this.id + '-tableWrapper';
        this.AddColumnModalId = this.id + '-AddColumnModal';
        this.AddColumnmodalErrorId = this.id + '-AddColumnmodalError';
        this.btnAddColumnSaveId = this.id + '-btnAddColumnSave';
        this.selectTypeColumnId = this.id + '-selectTypeColumn';
        this.txtNameColumnId = this.id + '-txtNameColumn';
        this.txtDataColumnId = this.id + '-txtDataColumn';
        this.divDataColumnsId = this.id + '-divDataColumns';
        this.imgId = this.id + '-img';
        this.txtWidthColumn = this.id + '-widthColumn';
    }
    vcanvas.prototype.initCss = function () {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `#${this.wrapperId}{ overflow:none; }
        #${this.canvasId}{
            /*border: 1px solid black;	*/
            border: 1px solid black;
        }`;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    vcanvas.prototype.init = function () {
        this.initId();
        this.initCss();
        var json = this.js;
        if (json || this.fromApi) {
            this.shapes = [];
            var RawData = {};
            if (!this.fromApi) RawData = JSON.parse(json);
            else RawData.shapes = this.RawShapeData;
            if (!this.fromApi) {
                this.types = RawData.types;
                this.backgroundUrl = RawData.backgroundUrl ? RawData.backgroundUrl : '';
                this.extColumns = RawData.extColumns;
                this.maxShape = RawData.maxShape;
                ExtendOtions = RawData.extColumns;
                if (!this.randomColor)
                    this.randomColor = RawData.randomColor;
            } else {
                ExtendOtions = this.extColumns;
            }

            this.htmlRender();
            if (!this.canvas) {
                this.canvas = new fabric.Canvas(this.id + '-canvas', {
                    selection: false,
                    controlsAboveOverlay: false
                });
                fabric.Circle.prototype.originX = fabric.Circle.prototype.originY = 'center';
                fabric.Line.prototype.originX = fabric.Line.prototype.originY = 'center';
            };

            this.canvas.renderAll();
            var mother = this;
            var bgr = new Background();
            fabric.Image.fromURL(this.backgroundUrl, function (img) {
                img.selectable = false;
                img.set({
                    name: 'background',
                    left: 0,
                    top: 0
                });
                mother.canvas.add(img);
                mother.canvas.sendToBack(img);

                if (img.height > 0 && img.width > 0) {
                    globalImageHeight = img.height;
                    bgr.height = img.height;
                    globalImageWidth = img.width;
                    bgr.width = img.width;
                    for (var i = 0; i < RawData.shapes.length; i++) {
                        var s = RawData.shapes[i];
                        var newShape = new Shape({
                            name: s.name,
                            type: s.type,
                            canvas: mother.canvas
                        });
                        if (s.type == types.Text) {
                            newShape.lbX = GetValueFromPercent(s.left, globalImageWidth);
                            newShape.lbY = GetValueFromPercent(s.top, globalImageHeight);
                        }
                        if (!mother.randomColor) {
                            if (newShape.type == types.Rect) newShape.color = colors.Rect;
                            if (newShape.type == types.Line) newShape.color = colors.Line;
                            if (newShape.type == types.VLine) newShape.color = colors.VerticalLine;
                            if (newShape.type == types.HLine) newShape.color = colors.HorizontalLine;
                            if (newShape.type == types.Text) newShape.color = colors.Text;
                        }
                        if (s.type != types.Text) {
                            for (var k = 0; k < s.middlePoints.length; k++) {
                                var p = s.middlePoints[k];
                                var newPoint = new Point({
                                    name: p.name,
                                    parentName: s.name,
                                    left: GetValueFromPercent(p.left, img.width),
                                    top: GetValueFromPercent(p.top, img.height),
                                    index: p.index,
                                    middlePoint: true
                                    // lockMovementX:(RawData.shapes[i].type === types.HLine)? false:true,
                                    // lockMovementY:(RawData.shapes[i].type === types.VLine)? false: true
                                });
                                newShape.middlePoints.push(newPoint);
                            }

                            for (var j = 0; j < s.points.length; j++) {
                                var p = s.points[j];
                                var newPoint = new Point({
                                    name: p.name,
                                    parentName: s.name,
                                    left: GetValueFromPercent(p.left, img.width),
                                    top: GetValueFromPercent(p.top, img.height),
                                    index: p.index
                                    // lockMovementX:(RawData.shapes[i].type === types.HLine)? false:true,
                                    // lockMovementY:(RawData.shapes[i].type === types.VLine)? false: true
                                });
                                if (s.type === types.HLine) {
                                    newPoint.lockMovementX = false;
                                    newPoint.lockMovementY = true;
                                } else if (s.type === types.VLine) {
                                    newPoint.lockMovementX = true;
                                    newPoint.lockMovementY = false;
                                } else if (s.type === types.Line || s.type === types.Rect) {
                                    newPoint.lockMovementX = false;
                                    newPoint.lockMovementY = false;
                                }
                                if (RawData.extColumns) {
                                    for (var z = 0; z < RawData.extColumns.length; z++) {
                                        var column = RawData.extColumns[z];
                                        newShape[column.name] = s[column.name];
                                    }
                                }
                                newShape.points.push(newPoint);
                            }
                        }
                        for (var k = 0; k < mother.extColumns.length; k++) {
                            var name = mother.extColumns[k].name;
                            newShape[name] = s[name] ? s[name] : null;
                        }

                        newShape.readOnly = s.readOnly;
                        newShape.viewOnly = s.viewOnly;
                        mother.shapes.push(newShape);
                    }
                    mother.canvas.renderAll();
                    mother.background = bgr;

                    mother.initEvent();
                    mother.shapes.forEach(function (s) {
                        s.Draw();
                    })
                    mother.loadDataToTable();
                }
            });

        } else {
            this.htmlRender();
            if (!this.canvas) {
                this.canvas = new fabric.Canvas(this.id + '-canvas', {
                    selection: false,
                    controlsAboveOverlay: false
                });
                this.LoadBackground(this.backgroundUrl);
                fabric.Circle.prototype.originX = fabric.Circle.prototype.originY = 'center';
                fabric.Line.prototype.originX = fabric.Line.prototype.originY = 'center';
                this.initEvent();
                this.loadDataToTable();
            }
        }

        return vcanvas;
    };
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
    vcanvas.prototype.initEvent = function () {
        var c = this.canvas;
        var mother = this;
        $(window).on('load', function () {
            $('#' + mother.btnChangeBackgroundSaveId).click(function () {
                url = $('#' + mother.txtImgUrlId).val();
                if (url) {
                    $('#' + mother.bgModalId).modal('hide');
                    $('#' + mother.modalErrorId).text("");
                    mother.LoadBackground({
                        url: url,
                        reloadAll: true
                    });
                    mother.Reset();
                } else {
                    $('#' + mother.bgModalId).modal('show');
                    $('#' + mother.modalErrorId).text("");
                    $('#' + mother.modalErrorId).text("Image url cannot be empty. Please enter your image url!");
                }

            })
            $('#' + mother.btnAddRectId).click(function () {
                url = mother.backgroundUrl;
                if (!url) {
                    $('#' + mother.bgModalId).modal('show');
                    $('#' + mother.modalErrorId).text("");
                    $('#' + mother.modalErrorId).text("There are no image yet. Please enter your image url to add image!");
                    return;
                }
                if (mother.shapes.length == mother.maxShape && mother.maxShape > 0) {
                    alert("You have reach to the limit of shapes, please change the max size value for drawing more!");
                    return;
                }
                mother.Add({
                    type: types.Rect
                });
            });

            $('#' + mother.btnAddTwoAreaRectHId).click(function () {
                url = mother.backgroundUrl;
                if (!url) {
                    $('#' + mother.bgModalId).modal('show');
                    $('#' + mother.modalErrorId).text("");
                    $('#' + mother.modalErrorId).text("There are no image yet. Please enter your image url to add image!");
                    return;
                }
                if (mother.shapes.length == mother.maxShape && mother.maxShape > 0) {
                    alert("You have reach to the limit of shapes, please change the max size value for drawing more!");
                    return;
                }
                mother.Add({
                    type: types.TwoAreaRectH
                });
            });

            $('#' + mother.btnAddTwoAreaRectVId).click(function () {
                url = mother.backgroundUrl;
                if (!url) {
                    $('#' + mother.bgModalId).modal('show');
                    $('#' + mother.modalErrorId).text("");
                    $('#' + mother.modalErrorId).text("There are no image yet. Please enter your image url to add image!");
                    return;
                }
                if (mother.shapes.length == mother.maxShape && mother.maxShape > 0) {
                    alert("You have reach to the limit of shapes, please change the max size value for drawing more!");
                    return;
                }
                mother.Add({
                    type: types.TwoAreaRectV
                });
            });

            $('#' + mother.btnAddText).click(function () {
                url = mother.backgroundUrl;
                if (!url) {
                    $('#' + mother.bgModalId).modal('show');
                    $('#' + mother.modalErrorId).text("");
                    $('#' + mother.modalErrorId).text("There are no image yet. Please enter your image url to add image!");
                    return;
                }
                if (mother.shapes.length == mother.maxShape && mother.maxShape > 0) {
                    alert("You have reach to the limit of shapes, please change the max size value for drawing more!");
                    return;
                }
                mother.Add({
                    type: types.Text
                });
            });
            $('#' + mother.btnAddVerticalLineId).click(function () {
                url = mother.backgroundUrl;
                if (!url) {
                    $('#' + mother.bgModalId).modal('show');
                    $('#' + mother.modalErrorId).text("");
                    $('#' + mother.modalErrorId).text("There are no image yet. Please enter your image url to add image!");
                    return;
                }
                if (mother.shapes.length == mother.maxShape && mother.maxShape > 0) {
                    alert("You have reach to the limit of shapes, please change the max size value for drawing more!");
                    return;
                }
                mother.Add({
                    type: types.VLine
                });
            });

            $('#' + mother.btnAddHorizontalLineId).click(function () {
                url = mother.backgroundUrl;
                if (!url) {
                    $('#' + mother.bgModalId).modal('show');
                    $('#' + mother.modalErrorId).text("");
                    $('#' + mother.modalErrorId).text("There are no image yet. Please enter your image url to add image!");
                    return;
                }
                if (mother.shapes.length == mother.maxShape && mother.maxShape > 0) {
                    alert("You have reach to the limit of shapes, please change the max size value for drawing more!");
                    return;
                }
                mother.Add({
                    type: types.HLine
                });
            });

            $('#' + mother.btnDrawLineId).click(function () {
                url = mother.backgroundUrl;
                if (!url) {
                    $('#' + mother.bgModalId).modal('show');
                    $('#' + mother.modalErrorId).text("");
                    $('#' + mother.modalErrorId).text("There are no image yet. Please enter your image url to add image!");
                    return;
                }
                if (mother.shapes.length == mother.maxShape && mother.maxShape > 0) {
                    alert("You have reach to the limit of shapes, please change the max size value for drawing more!");
                    return;
                }
                mother.isDrawing = true;
            });
            $('#' + mother.btnExportId).click(function () {
                var js = mother.ToJson();
                console.log(js);
                $('#' + mother.txtDataId).val(js);
            });
            $('#' + mother.btnResetZoomId).click(function () {
                mother.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
                var img = mother.getItem('background', null);
                if (img) {
                    var scaleFactor = mother.currentWidth / img.width;
                    c.setZoom(scaleFactor / 1.1);
                } else {
                    mother.canvas.setZoom(0.51);
                }
                var objects = c.getObjects();
                for (var i in objects) {
                    if (objects[i].get('type') == 'image' || objects[i].get('type') == "path") continue;

                    if (objects[i].get('type') == "line") {
                        objects[i].strokeWidth = 3;
                        globalStrokeWidth = objects[i].strokeWidth;
                        continue;
                    }
                    objects[i].scaleX /= 1.1;
                    objects[i].scaleY /= 1.1;
                    globalScaleValue = objects[i].scaleX;
                    objects[i].setCoords();

                }
                mother.canvas.renderAll();
            })
            $('#' + mother.btnZoomInId).click(function () {
                mother.canvas.setZoom(mother.canvas.getZoom() * 1.1);
                var objects = c.getObjects();
                for (var i in objects) {
                    if (objects[i].get('type') == "line") {
                        objects[i].strokeWidth /= 1.1;
                        globalStrokeWidth = objects[i].strokeWidth;
                        continue;
                    }
                    if (objects[i].get('type') == 'image' || objects[i].get('type') == "path") continue;
                    objects[i].scaleX /= 1.1;
                    objects[i].scaleY /= 1.1;
                    globalScaleValue = objects[i].scaleX;
                    objects[i].setCoords();

                }
            })
            $('#' + mother.btnZoomOutId).click(function () {
                mother.canvas.setZoom(mother.canvas.getZoom() / 1.1);
                var objects = c.getObjects();
                for (var i in objects) {
                    if (objects[i].get('type') == "line") {
                        objects[i].strokeWidth *= 1.1;
                        globalStrokeWidth = objects[i].strokeWidth;
                        continue;
                    }
                    if (objects[i].get('type') == 'image' || objects[i].get('type') == "path") continue;
                    objects[i].scaleX *= 1.1;
                    objects[i].scaleY *= 1.1;
                    globalScaleValue = objects[i].scaleX;
                    objects[i].setCoords();

                }
            })
            $(c.wrapperEl).on('mousewheel', function (e) {
                var delta = e.originalEvent.wheelDelta / 500;
                var pointer = c.getPointer(e.e);
                var scaleFactor = 0;
                var objects = c.getObjects();
                if (delta > 0) {
                    scaleFactor = c.getZoom() * 1.1;
                    c.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), scaleFactor);
                    for (var i in objects) {
                        if (objects[i].get('type') == 'image' || objects[i].get('type') == "path") continue;

                        if (objects[i].get('type') == "line") {
                            objects[i].strokeWidth /= 1.1;
                            globalStrokeWidth = objects[i].strokeWidth;
                            continue;
                        }
                        objects[i].scaleX /= 1.1;
                        objects[i].scaleY /= 1.1;
                        globalScaleValue = objects[i].scaleX;
                        objects[i].setCoords();

                    }
                }
                if (delta < 0) {
                    scaleFactor = c.getZoom() / 1.1;
                    c.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), scaleFactor);
                    for (var i in objects) {
                        if (objects[i].get('type') == "line") {
                            objects[i].strokeWidth *= 1.1;
                            globalStrokeWidth = objects[i].strokeWidth;
                            continue;
                        }
                        if (objects[i].get('type') == 'image' || objects[i].get('type') == "path") continue;
                        objects[i].scaleX *= 1.1;
                        objects[i].scaleY *= 1.1;
                        globalScaleValue = objects[i].scaleX;
                        objects[i].setCoords();

                    }
                }



                return false;
            });
            if (c.width != $("#" + mother.id + '-wrapper').width()) {
                var scaleMultiplier = $("#" + mother.id + '-wrapper').width() / c.width;
                var objects = c.getObjects();

                c.setWidth(c.getWidth() * scaleMultiplier);
                c.setHeight(c.getHeight() * scaleMultiplier);
                c.renderAll();
                c.calcOffset();
                mother.currentWidth = c.getWidth();
                mother.currentHeight = c.getHeight();
            }
            $(window).resize(function () {
                if (c.width != $("#" + mother.id + '-wrapper').width()) {
                    var scaleMultiplier = $("#" + mother.id + '-wrapper').width() / c.width;
                    var objects = c.getObjects();
                    c.setWidth(c.getWidth() * scaleMultiplier);
                    c.setHeight(c.getHeight() * scaleMultiplier);
                    c.renderAll();
                    c.calcOffset();
                    mother.currentWidth = c.getWidth();
                    mother.currentHeight = c.getHeight();
                }
            });
            var img = mother.getItem('background', null);
            if (img) {
                var scaleFactor = mother.currentWidth / img.width;
                c.setZoom(scaleFactor / 1.1);
            }
        });
        c.on({
            'mouse:down': function (o) {
                var pointer = c.getPointer(o.e);
                x0 = pointer.x;
                y0 = pointer.y;
                if (o.e.type == "touchstart") {
                    startX = o.e.touches[0].pageX;
                    startY = o.e.touches[0].pageY;
                }

                if ((o.e.type === 'touchmove') && (o.e.touches.length > 1)) {
                    return;
                }
                if (mother.isDrawing) {
                    c.defaultCursor = "pointer";
                    mother.isMouseDown = true;
                    var pointer = c.getPointer(o.e);
                    var result = mother.randomName(types.Line);

                    var A = new Point({
                        index: 0,
                        name: "P-1",
                        parentName: result.name,
                        left: pointer.x,
                        top: pointer.y,
                        canvas: c
                    });
                    var B = new Point({
                        index: 1,
                        name: "P-2",
                        parentName: result.name,
                        left: pointer.x,
                        top: pointer.y,
                        canvas: c
                    });
                    var line = new Shape({
                        name: result.name,
                        index: result.index,
                        type: types.Line,
                        points: [A, B],
                        canvas: c,
                        color: colors.Line
                    });
                    line.Draw({
                        scaleFactor: globalScaleValue,
                        strokeWidth: globalStrokeWidth
                    });
                    mother.ActiveObject = line;
                } else if (mother.AddPointMode) {
                    var newPoint = new Point({
                        left: x0,
                        top: y0
                    });
                    mother.ActiveObject.AddPoint(newPoint);
                } else {
                    var obj = o.target;
                    if (!obj || obj.get('type') === "image") {
                        mother.panning = true;
                        // canvas.defaultCursor = "all-scroll";
                        var allObject = c.getObjects();
                        for (var i = 0; i < allObject.length; i++) {
                            if (allObject[i].get('type') === "circle") {
                                allObject[i].set({
                                    radius: 10
                                });
                            }
                        }
                    }
                }
            },
            'mouse:move': function (o) {
                if (mother.isMouseDown && mother.isDrawing) {
                    var pointer = c.getPointer(o.e);
                    mother.ActiveObject.Remove();
                    for (var i = 0; i < mother.ActiveObject.points.length; i++) {
                        if (mother.ActiveObject.points[i].name === "P-2") {
                            mother.ActiveObject.points[i].left = pointer.x;
                            mother.ActiveObject.points[i].top = pointer.y;
                        }
                    }
                    mother.ActiveObject.Draw({
                        scaleFactor: globalScaleValue,
                        strokeWidth: globalStrokeWidth
                    });
                    //line.set({ x2: pointer.x, y2: pointer.y });
                    c.renderAll();
                }
                if (mother.panning && o && o.e) {
                    if (o.e.type !== "touchmove") {
                        var delta = new fabric.Point(o.e.movementX, o.e.movementY);
                        c.relativePan(delta);
                    } else {
                        var delta = new fabric.Point((o.e.touches[0].pageX - startX) / 10, (o.e.touches[0].pageY - startY) / 10);
                        c.relativePan(delta);
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
            'mouse:out': function (e) {
                if (mother.tempPoint) {
                    c.remove(mother.tempPoint);
                    mother.tempPoint = null;
                    mother.LineHovered = null;
                }
            },
            'mouse:up': function (o) {
                if (mother.isDrawing) {
                    mother.ActiveObject.Remove();
                    mother.ActiveObject.Draw({
                        scaleFactor: globalScaleValue,
                        strokeWidth: globalStrokeWidth
                    });
                    mother.shapes.push(mother.ActiveObject);
                    // mother.canvas.renderAll();
                    mother.loadDataToTable();
                    mother.triggerHandler('CanvasModified', {
                        event: 'AddLine',
                        source: mother.ActiveObject
                    });
                }
                if (mother.ActiveObject && mother.ActiveObject.isMoving) {
                    mother.ActiveObject.isMoving = false;
                    mother.loadDataToTable();
                    mother.triggerHandler('CanvasModified', {
                        event: 'Moving',
                        source: mother.ActiveObject
                    });
                }
                mother.panning = false;
                mother.isDrawing = false;
                mother.isMouseDown = false;
            },
            'object:moving': function (e) {
                var p = e.target;
                var obj = e.target;
                var scaleValue = p.scaleX;
                var pointer = c.getPointer(e.e);
                var allObject = c.getObjects();

                if (p.name.split('-')[0] == "i" || p.name.split('-')[0] == 'lb') {
                    for (var i = 0; i < mother.shapes.length; i++) {
                        if (p.parentName == mother.shapes[i].name) {
                            mother.ActiveObject = mother.shapes[i];
                            mother.ActiveObject.isMoving = true;
                            mother.shapes[i].Move({
                                offsetX: e.e.movementX * globalStrokeWidth,
                                offsetY: e.e.movementY * globalStrokeWidth,
                                scaleFactor: globalScaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                            break;
                        }
                    }
                } else if (p.name.split('-')[0] == 'Text') {
                    for (var i = 0; i < mother.shapes.length; i++) {
                        if (p.name == mother.shapes[i].name) {
                            mother.ActiveObject = mother.shapes[i];
                            mother.ActiveObject.isMoving = true;
                            mother.shapes[i].Move({
                                offsetX: p.left,
                                offsetY: p.top,
                                scaleFactor: scaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                            break;
                        }
                    }
                } else {
                    for (var i = 0; i < mother.shapes.length; i++) {
                        if (p.parentName === mother.shapes[i].name) {
                            mother.ActiveObject = mother.shapes[i];
                            mother.ActiveObject.isMoving = true;
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

        });
    };
    vcanvas.prototype.htmlRender = function (Id) {
        var str = `<div class="modal fade canvas-div" id="${this.bgModalId}" role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Change background</h5>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body">
                                    <p>Image url:</p><p id="${this.modalErrorId}" class="text-danger"></p>
                                    <textarea id="${this.txtImgUrlId}" style="width: 100%; height:100px"></textarea>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" id="${this.btnChangeBackgroundSaveId}">Save</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-9 col-xs-12 canvas-div">
                        <div class="col-md-12 col-xs-12 canvas-div">
                            ${this.types.map(t => `${(t == types.Rect) ? `<button type="button" class="btn btn-sm btn-primary" id="${this.btnAddRectId}" ><i class="fa fa-plus"></i> Add Rect</button>` : ``}
                            ${(t == types.TwoAreaRectH)? `<button type="button" class="btn btn-sm btn-primary" id="${this.btnAddTwoAreaRectHId}"><i class="fa fa-plus"></i> Add Two Area Rect with horizontal line</button>`:``}
                            ${(t == types.TwoAreaRectH)? `<button type="button" class="btn btn-sm btn-primary" id="${this.btnAddTwoAreaRectVId}"><i class="fa fa-plus"></i> Add Two Area Rect with vertical line</button>`:``}
                            ${(t == types.Text) ? `<button type="button" class="btn btn-sm btn-Default" id="${this.btnAddText}" ><i class="fa fa-plus"></i> Add Text</button>` : ``}
                            ${(t == types.VLine || t == types.Line) ? `<button type="button" class="btn btn-sm btn-success" id="${this.btnAddVerticalLineId}"><i class="fa fa-arrows-v"></i> Add vertical line</button>` : ``}
                            ${(t == types.HLine || t == types.Line) ? `<button type="button" class="btn btn-sm btn-success" id="${this.btnAddHorizontalLineId}"><i class="fa fa-arrows-h"></i> Add horizontal line</button>` : ``}
                            ${(t == types.Line || t == types.Line) ? `<button type="button" class="btn btn-sm btn-danger" id="${this.btnDrawLineId}"><i class="fa fa-pencil"></i> Draw line</button>` : ``}
                            `)
            }
                        </div>
                        <div class="col-md-12 col-xs-12 canvas-div">
                            <button type="button" class="btn btn-sm" id="${this.btnZoomInId}"><i class="fa fa-search-plus"></i> Zoom in</button>
                            <button type="button" class="btn btn-sm" id="${this.btnZoomOutId}"><i class="fa fa-search-minus"></i> Zoom out</button>
                            <button type="button" class="btn btn-sm btn-default" id="${this.btnResetZoomId}" hidden="true"><i class="fa fa-history"></i> Reset zoom</button>
                            <button type="button" class="btn btn-sm btn-default" id="${this.btnAddBackgroundId}" data-toggle="modal" data-target="#${this.bgModalId}"><i class="fa fa-file-image-o"></i> Change background</button>
                            <label class="${this.lblNoteId}" style="padding-left: 20px; color: red;" id="${this.lblNoteId}"></label>
                            <input class="canvas-input" type="text" name="${this.txtNameId}" id="${this.txtNameId}" hidden="true" width="10">
                            <input class="canvas-input" type="text" name="${this.txtDataId}" id="${this.txtDataId}" hidden="true" width="10">
                        </div>
                        <div class="col-xs-12 col-md-12 canvas-div">
                            <div id="${this.wrapperId}">
                                <canvas id="${this.canvasId}">
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-3 col-xs-12 canvas-div">
                        <div class="col-sm-12 canvas-div">
                        <button type="button" class="btn btn-sm btn-success" id="${this.btnExportId}"><i class="fa fa-cloud-download"></i> Export to JSON</button>
                        <button type="button" class="btn btn-sm btn-default" id="${this.btnNewColumnId}" data-toggle="modal" data-target="#${this.AddColumnModalId}"><i class="fa fa-plus"></i> Add column</button>
                        </div>
                        <div class="col-sm-12 canvas-div" style="overflow: auto">
                            <div id="${this.tableWrapperId}" class="table-editable">
                            <table id="${this.tableId}" class="tblShape table table-hover table-sm text-center">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        ${this.extColumns.map(c => `
                                            ${c.name ? `<th>${c.name}</th>` : ``}
                                        `)}
                                        <th id="0"></th>
                                    </tr>
                                </thead><tbody></tbody></table>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="${this.AddColumnModalId}" role="dialog">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Add column</h5>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body">
                                    <form class="form-row align-items-center">
                                        <div class="col-sm-4">
                                            <label for="${this.txtNameColumnId}">Name</label>
                                            <input id="${this.txtNameColumnId}" class="canvas-input form-control form-control-sm" placeholder="">
                                        </div>
                                        <div class="col-sm-3">
                                            <label for="${this.AddColumnmodalErrorId}">Type</label>
                                            <select id="${this.selectTypeColumnId}" class="form-control form-control-sm"></select>
                                        </div>
                                        <div class="col-sm-3">
                                            <label for="${this.txtWidthColumn}">width</label>
                                            <input id="${this.txtWidthColumn}" class="canvas-input form-control form-control-sm" placeholder="">
                                        </div>
                                        <br>
                                        <div id="${this.divDataColumnsId}" class="col-sm-12">
                                            <label for="${this.txtDataColumnId}">Data</label>
                                            <textarea id="${this.txtDataColumnId}" style="width:100%, height: 100px" class="form-control"></textarea>
                                        </div>
                                    </form>
                                    <p id="${this.AddColumnmodalErrorId}" class="text-danger"></p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" id="${this.btnAddColumnSaveId}">Save</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

        var mother = this;
        $('#' + this.txtNameColumnId).keypress(function () {
            return mother.ValidateKey();
        });
        $('#' + this.txtWidthColumn).keypress(function () {
            return mother.ValidateNumber();
        });
        $(`#${this.selectTypeColumnId}`).change(function () {
            var element = $(`#${mother.divDataColumnsId}`);
            if (this.value == typeColumns.Combobox) {
                element.hidden = false;
            } else {
                element.hidden = true;
            }
        });
        if ($(`#${this.parent}`).length) {
            $(`#${this.parent}`).append(str);

        }
        for (var key in typeColumns) {
            $(`#${this.selectTypeColumnId}`).append($(`<option value="${typeColumns[key]}">${key}</option>`));
        }

        $(`#${this.btnAddColumnSaveId}`).click(function () {
            var myTable = $('#' + mother.tableId);
            var name = $(`#${mother.txtNameColumnId}`).val();
            var isNameEsxit = false;
            if (name) {
                $('#' + mother.AddColumnmodalErrorId).text("");
                for (var i = 0; i < mother.extColumns.length; i++) {
                    if (name == mother.extColumns[i].name) {
                        $('#' + mother.AddColumnmodalErrorId).text("Column name already exsit, please choose a different name!");
                        isNameEsxit = true;
                        break;
                    }
                };
                if (isNameEsxit) {
                    return;
                }
                var type = $(`#${mother.selectTypeColumnId}`).val();
                var data = $(`#${mother.txtDataColumnId}`).val().split(';');
                var width = $(`#${mother.txtWidthColumn}`).val();
                if (type == typeColumns.Combobox) {
                    if (!data || data.length <= 0 || data[0] == '') {
                        $('#' + mother.AddColumnmodalErrorId).text("Please enter items for combobox, each item seperate by a ';' character.");
                        return;
                    } else {
                        $('#' + mother.AddColumnmodalErrorId).text("");
                    }
                }
                var newColumn = new extColumn({
                    name: name,
                    type: type,
                    data: data,
                    width: width

                });
                var context;
                myTable.find('th').each(function (i, element) {
                    //console.log(element.id);
                    if (element.id == '0')
                        $(element).before(`<th>${newColumn.name}</th>`);

                });
                myTable.find('td').each(function (i, element) {
                    //console.log(element.id);
                    if (element.id == '0') {
                        var shapeName = element.parentElement.cells[2].children[0].value;
                        if (newColumn.type == typeColumns.Text)
                            context = `<input id="${mother.id + '-' + shapeName + '-input-' + newColumn.name}" class="canvas-input" type="text" style="border:none;width:${width?width+'px':'50px'}"/>`;
                        if (newColumn.type == typeColumns.Number) {
                            context = `<input id="${mother.id + '-' + shapeName + '-number-' + newColumn.name}" name="${mother.id + '-' + shapeName + '-number-' + newColumn.name}" class="canvas-input ui-spinner-input" style="border:none;width:${width?width+'px':'50px'}"/>`;
                            $(`#${mother.id + '-' + shapeName + '-number-' + newColumn.name}`).click(function () {
                                //alert('clicked');
                            });
                        }
                        if (newColumn.type == typeColumns.Combobox) {
                            context = `<select id="${mother.id + '-' + shapeName + '-select-' + newColumn.name}" style="border:none;width:${width?width+'px':'50px'}">${data.map(d=>`
                        ${d?`<option value="${d}">${d}</option>`:``}
                        `)}</select>`;
                        }
                        if (newColumn.type == typeColumns.Checkbox)
                            context = `<input class="canvas-input" id="${mother.id + '-' + shapeName + '-checkbox-' + newColumn.name}"  type="checkbox" style="width:${width?width+'px':'50px'}"/>`;
                        $(element).before(`<td>${context}</td>`);
                    }
                });
                mother.extColumns.push(newColumn);
                mother.shapes.forEach(function (s) {
                    mother.extColumns.forEach(function (c) {
                        $(`#${mother.id + '-' + s.name + '-input-' + c.name}`).change(function () {
                            s[c.name] = this.value;
                            s.Remove();
                            s.Draw({
                                scaleFactor: globalScaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                            mother.triggerHandler('CanvasModified', {
                                event: c.name + " change",
                                source: mother
                            });
                        });
                        $(`#${mother.id + '-' + s.name + '-number-' + c.name}`).change(function () {
                            // var element = this;
                            s[c.name] = this.value;
                            s.Remove();
                            s.Draw({
                                scaleFactor: globalScaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                            mother.triggerHandler('CanvasModified', {
                                event: c.name + " change",
                                source: mother
                            });
                        });
                        $(`#${mother.id + '-' + s.name + '-select-' + c.name}`).change(function () {
                            s[c.name] = this.value;
                            s.Remove();
                            s.Draw({
                                scaleFactor: globalScaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                            mother.triggerHandler('CanvasModified', {
                                event: c.name + " change",
                                source: mother
                            });
                        });
                        $(`#${mother.id + '-' + s.name + '-checkbox-' + c.name}`).change(function () {
                            s[c.name] = this.value;
                            s.Remove();
                            s.Draw({
                                scaleFactor: globalScaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                            mother.triggerHandler('CanvasModified', {
                                event: c.name + " change",
                                source: mother
                            });
                        });
                        mother.extColumns.forEach(function (c) {
                            $('#' + mother.id + '-' + s.name + '-number-' + c.name).spinner({
                                spin: function (event, ui) {
                                    s.Remove();
                                    s.Draw({
                                        scaleFactor: globalScaleValue,
                                        strokeWidth: globalStrokeWidth
                                    });
                                    s[c.name] = ui.value;
                                },
                                change: function (event, ui) {
                                    var element = document.getElementById(mother.id + '-' + s.name + '-number-' + c.name);
                                    s[c.name] = element.value;
                                    s.Remove();
                                    s.Draw({
                                        scaleFactor: globalScaleValue,
                                        strokeWidth: globalStrokeWidth
                                    });
                                    mother.triggerHandler('CanvasModified', {
                                        event: c.name + " change",
                                        source: mother
                                    });
                                    s.Remove();
                                    s.Draw({
                                        scaleFactor: globalScaleValue,
                                        strokeWidth: globalStrokeWidth
                                    });
                                }
                            });
                        });
                    });
                });

                $('#' + mother.AddColumnModalId).modal('hide');
            } else {
                $('#' + mother.AddColumnModalId).modal('show');
                $('#' + mother.AddColumnmodalErrorId).text("");
                $('#' + mother.AddColumnmodalErrorId).text("please enter a valid name for column!");
            }
        });
    }
    vcanvas.prototype.Reset = function () {
        this.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
        var img = this.getItem('background', null);
        if (img) {
            var scaleFactor = this.currentWidth / img.width;
            this.canvas.setZoom(scaleFactor / 1.1);
        } else {
            this.canvas.setZoom(0.51);
        }
        var objects = this.canvas.getObjects();
        for (var i in objects) {
            if (objects[i].get('type') == 'image' || objects[i].get('type') == "path") continue;

            if (objects[i].get('type') == "line") {
                objects[i].strokeWidth = 3;
                globalStrokeWidth = objects[i].strokeWidth;
                continue;
            }
            objects[i].scaleX /= 1.1;
            objects[i].scaleY /= 1.1;
            globalScaleValue = objects[i].scaleX;
            objects[i].setCoords();

        }
        this.canvas.renderAll();
    }
    vcanvas.prototype.loadDataToTable = function () {
        var mother = this;
        var context;
        parentElement = null;
        var stt = 0;
        context = `${mother.shapes.map(s =>
            `${s.viewOnly?``:`
            <tr>
            <td class="text-center"  data-toggle="collapse" data-target="#${mother.id + '-'+s.name+'tr-pointDetail'}">
                ${++stt}
            </td>
                <td>
                    <span id="${mother.id + '-' + s.name + '-spanRemoveShape-' + s.name}" class="table-remove fa fa-trash-o"></span>
                </td>
                <td>
                    ${(s.type == types.Rect && s.points.length <= 4)? `<span id="${mother.id + '-' + s.name + '-calibRect-' + s.name}" class="table-calibRect fa fa-crop"></span>`:``}
                </td>
                <td>
                    <label style="width:80px;padding:0px;margin:0px;font-size:10pt" id="${mother.id + '-' + s.name + '-lblreadonly'}"><input type="checkbox" style="vertical-align: middle;" name="${mother.id + '-' + s.name + '-readonly'}" id="${mother.id + '-' + s.name + '-readonly'}" ${s.readOnly? `Checked`:``} > Readonly</label>
                </td>
                <td class="text-center">
                    <input id="${mother.id + '-' + s.name + '-input-' + s.name}" type="text" style="border:none; width:100%;padding:0px;margin:0px" value="${s.name}" />
                </td>
                <td>
                    ${getKeyByValue(types, s.type)}
                </td>
                ${s.type == types.Text ? `

                `:`
                ${this.extColumns.map(c => `
                    ${(c.type == typeColumns.Text) ? `
                    <td class="text-center"><input id="${mother.id + '-' + s.name + '-input-' + c.name}"  type="text" style="border:none; width:${c.width?c.width+'px':'50px'};padding:0px;margin:0px" value="${s[c.name]!=null?s[c.name]:``}" />
                    </td>`: ``}
                    ${(c.type == typeColumns.Number) ? `
                    <td class="text-center"><input id="${mother.id + '-' + s.name + '-number-' + c.name}" name="value" style="border:none; width:${c.width?c.width+'px':'50px'};padding:0px;margin:0px" value="${s[c.name]!=null?s[c.name]:``}" />
                    </td>`: ``}
                    ${(c.type == typeColumns.Combobox) ? `
                    <td class="text-center">
                        <select id="${mother.id + '-' + s.name + '-select-' + c.name}" style="border:none; width:${c.width?c.width+'px':'50px'}">
                        ${c.data? c.data.map(d=>`<option ${d==s[c.name]!=null? `selected="selected"`:``} value="${d}">${d}</option>
                        `):``}
                        </select>
                    </td>`: ``}
                    ${(c.type == typeColumns.Checkbox) ? `
                    <td><input id="${mother.id + '-' + s.name + '-checkbox-' + c.name}"  type="checkbox" style="width:${c.width?c.width+'px':'50px'};padding:0px;margin:0px"/>
                    </td>`: ``}
                `)}
                `}
                
                <td id="0" data-col="0" class="text-center">
                    ${(s.type == types.Rect) ? (s.AddPointMode ? `
                    <label class="switch"><input type="checkbox" id="${mother.id + '-' + s.name + '-switch-' + s.name}" checked title="Click on picture where you want to add point!"><span class="slider round"></span></label>` : `
                    <label class="switch"><input type="checkbox" id="${mother.id + '-' + s.name + '-switch-' + s.name}"><span class="slider round"></span></label>`):``}</td>
                
            </tr>
            <tr>
                <td colspan="10" class="hiddenRow">
                    <div id="${mother.id + '-'+s.name+'tr-pointDetail'}" class="accordian-body collapse">
                    <table style="background-color: #fff;" class="tblShapeDetail table" >
                        <thead>
                        ${s.type==types.Text?`<tr><td><b>X</b></td><td><b>Y</b></td><td></td></tr>`:
                        `<tr><td><b>Point</b></td><td><b>X</b></td><td><b>Y</b></td><td></td></tr>`}
                            
                        </thead>
                    <tbody>
                ${s.type==types.Text? `
                <tr id="${mother.id + '-tr-' + s.name}" class="text-center">
                        <td  hidden="true">${s.name}</td>
                        <td>${(mother.background.width) ? parseFloat(s.lbX / mother.background.width).toFixed(2) : parseFloat(s.lbX).toFixed(2)}</td>
                        <td>${(mother.background.height) ? parseFloat(s.lbY / mother.background.height).toFixed(2) : parseFloat(s.lbY).toFixed(2)}</td>
                        `:
                `${s.points.map(p =>
                    `<tr id="${mother.id + '-' + s.name + '-tr-' + p.name}" class="text-center">
                        <td  hidden="true">${s.name}</td>
                        <td>${p.name}</td>
                        <td>${(mother.background.width) ? parseFloat(p.left / mother.background.width).toFixed(2) : parseFloat(p.left).toFixed(2)}</td>
                        <td>${(mother.background.height) ? parseFloat(p.top / mother.background.height).toFixed(2) : parseFloat(p.top).toFixed(2)}</td>
                        ${s.type == types.Rect ? `
                            <td><span id="${mother.id + '-' + s.name + '-spanRemovePoint-' + p.name}" class="point-remove fa fa-eraser"></span></td>` : ``}
                        </tr>`).join('')}`
                }
                ${s.middlePoints.map(p=>`
                    <tr id="${mother.id+'-'+s.name+'-tr-'+p.name}" class="text-center">
                        <td hidden="true">${s.name}</td>
                        <td>${p.name}</td>
                        <td>${(mother.background.width) ? parseFloat(p.left / mother.background.width).toFixed(2) : parseFloat(p.left).toFixed(2)}</td>
                        <td>${(mother.background.height) ? parseFloat(p.top / mother.background.height).toFixed(2) : parseFloat(p.top).toFixed(2)}</td>
                    </tr>
                `)}
                
                    </tbody>
                    </table>
            <div id="${mother.id+ '-' + s.name}-dialog-confirm" title="Are you sure to delete ${s.name} ?"></div>
            </div>
            </td></tr>
            `}
            `)}`;
        $('.accordian-body').on('show.bs.collapse', function () {
            $(this).closest("table")
                .find(".collapse.in")
                .not(this)
                .collapse('toggle')
        })
        $('#' + this.tableId + ' tr').not(function () {
            return !!$(this).has('th').length;
        }).remove();
        $('#' + this.tableId + ' tr:last').after(context);
        mother.shapes.forEach(function (s) {
            $(`#${mother.id + '-' + s.name + '-readonly'}`).change(function () {
                if (this.checked) {
                    s.readOnly = true;
                } else {
                    s.readOnly = false;
                }
                s.Remove();
                s.Draw({
                    scaleFactor: globalScaleValue,
                    strokeWidth: globalStrokeWidth
                });
            });
            $('#' + mother.id + '-' + s.name + '-input-' + s.name).click(function () {
                mother.onInputClicked(s)
            });
            $('#' + mother.id + '-' + s.name + '-input-' + s.name).keypress(function () {
                return mother.ValidateKey()
            });
            $('#' + mother.id + '-' + s.name + '-input-' + s.name).change(function () {
                if (!s.readOnly)
                    mother.textChange(mother.id + '-' + s.name + '-input-' + s.name);
            });
            $('#' + mother.id + '-' + s.name + '-switch-' + s.name).change(function () {
                if (!s.readOnly)
                    mother.onChangeAddPoint(s, mother.id + '-' + s.name + '-switch-' + s.name);
            });
            $(`#${mother.id + '-' + s.name + '-calibRect-' + s.name}`).click(function () {
                if (!s.readOnly)
                    s.CalibRect();
            });
            $('#' + mother.id + '-' + s.name + '-spanRemoveShape-' + s.name).click(function () {
                $(`#${mother.id+ '-' + s.name}-dialog-confirm`).dialog({
                    resizable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    show: {
                        effect: "fade",
                        duration: 300
                    },
                    hide: {
                        effect: "fade",
                        duration: 200
                    },
                    buttons: {
                        "Delete": function () {
                            mother.onRemoveShapeClicked(s);
                            $(this).dialog("close");
                        },
                        Cancel: function () {
                            $(this).dialog("close");
                        }
                    }
                });
            });
            s.points.forEach(function (p) {
                $('#' + mother.id + '-' + s.name + '-tr-' + p.name).click(function () {
                    mother.onPointTrclicked(p)
                });
                $('#' + mother.id + '-' + s.name + '-spanRemovePoint-' + p.name).click(function () {
                    mother.onPointRemoveClick(p)
                });
            });
            s.middlePoints.forEach(function (p) {
                $('#' + mother.id + '-' + s.name + '-tr-' + p.name).click(function () {
                    mother.onPointTrclicked(p)
                });
            });
            if (mother.extColumns) {
                mother.extColumns.forEach(function (c) {
                    $('#' + mother.id + '-' + s.name + '-number-' + c.name).spinner({
                        change: function () {
                            if (!s.viewOnly) {
                                var element = document.getElementById(mother.id + '-' + s.name + '-number-' + c.name);

                                s[c.name] = element.value;

                                s.Remove();
                                s.Draw({
                                    scaleFactor: globalScaleValue,
                                    strokeWidth: globalStrokeWidth
                                });
                                mother.triggerHandler('CanvasModified', {
                                    event: c.name + " spinned",
                                    source: mother
                                });
                            }
                        }
                    });
                    $(`#${mother.id + '-' + s.name + '-number-' + c.name}`).change(function () {
                        if (!s.viewOnly) {
                            var element = document.getElementById(mother.id + '-' + s.name + '-number-' + c.name);

                            s[c.name] = element.value;

                            s.Remove();
                            s.Draw({
                                scaleFactor: globalScaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                            mother.triggerHandler('CanvasModified', {
                                event: c.name + " change",
                                source: mother
                            });
                            s.Remove();
                            s.Draw({
                                scaleFactor: globalScaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                        }
                    });
                    if (c.type == typeColumns.Combobox) {
                        if (!s.viewOnly) {
                            var element = document.getElementById(mother.id + '-' + s.name + '-select-' + c.name);

                            s[c.name] = element.value;

                            s.Remove();
                            s.Draw({
                                scaleFactor: globalScaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                        }
                        mother.triggerHandler('CanvasModified', {
                            event: c.name + " checked",
                            source: mother
                        });
                    }
                    $(`#${mother.id + '-' + s.name + '-select-' + c.name}`).change(function () {
                        if (!s.viewOnly) {
                            var element = document.getElementById(mother.id + '-' + s.name + '-select-' + c.name);

                            s[c.name] = element.value;

                            s.Remove();
                            s.Draw({
                                scaleFactor: globalScaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                            mother.triggerHandler('CanvasModified', {
                                event: c.name + " change",
                                source: mother
                            });
                        }
                    });
                    $(`#${mother.id + '-' + s.name + '-input-' + c.name}`).change(function () {
                        if (!s.viewOnly) {
                            var element = document.getElementById(mother.id + '-' + s.name + '-input-' + c.name);
                            s[c.name] = element.value;
                            s.Remove();
                            s.Draw({
                                scaleFactor: globalScaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                            mother.triggerHandler('CanvasModified', {
                                event: c.name + " change",
                                source: mother
                            });
                            s.Remove();
                            s.Draw({
                                scaleFactor: globalScaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                        }
                    });
                    $(`#${mother.id + '-' + s.name + '-checkbox-' + c.name}`).click(function () {
                        if (!s.viewOnly) {
                            var element = document.getElementById(mother.id + '-' + s.name + '-checkbox-' + c.name);
                            s[c.name] = element.checked;
                            s.Remove();
                            s.Draw({
                                scaleFactor: globalScaleValue,
                                strokeWidth: globalStrokeWidth
                            });
                            mother.triggerHandler('CanvasModified', {
                                event: c.name + " checked",
                                source: mother
                            });
                        }
                    })
                });
            }
        });
    };
    vcanvas.prototype.onPointTrclicked = function (obj) {
        var allObject = this.canvas.getObjects();
        for (var i = 0; i < allObject.length; i++) {
            if (allObject[i].get('type') === "circle") {
                allObject[i].set({
                    radius: 10
                });
            }
        }
        var point = this.canvas.getItem(obj.name, obj.parentName);
        point.set({
            radius: 15
        });
        this.canvas.renderAll();
    }
    vcanvas.prototype.onPointRemoveClick = function (obj) {
        var obj = this.Get(obj.parentName);
        obj.RemovePoint(obj.name);
        this.loadDataToTable();
    }
    vcanvas.prototype.onChangeAddPoint = function (obj, id) {
        var name = obj.name;
        var element = document.getElementById(id);
        if (element.checked) {
            for (var i = 0; i < this.shapes.length; i++) {
                if (this.shapes[i].name === name) {
                    this.AddPointMode = true;
                    this.ActiveObject = this.shapes[i];
                    this.shapes[i].AddPointMode = true;
                } else {
                    this.shapes[i].AddPointMode = false;
                }
            }
            this.loadDataToTable();
            $('#' + this.lblNoteId).text("Click on canvas where you want to add point!");
        } else {
            this.AddPointMode = false;
            $('#' + this.lblNoteId).text("");
            for (var i = 0; i < this.shapes.length; i++) {
                if (this.shapes[i].name === name) {
                    this.shapes[i].AddPointMode = false;
                }
            }
        }
    }
    vcanvas.prototype.onRemoveShapeClicked = function (obj) {
        this.Remove(obj.name);
        this.loadDataToTable();
    }
    vcanvas.prototype.onInputClicked = function (obj) {
        var name = obj.name;
        var points = [];
        var allObject = this.canvas.getObjects();
        for (var i = 0; i < allObject.length; i++) {
            if (allObject[i].get('type') === "circle") {
                allObject[i].set({
                    radius: 10
                });
            }
        }
        for (var i = 0; i < this.shapes.length; i++) {
            if (this.shapes[i].name === name) {
                for (var j = 0; j < this.shapes[i].points.length; j++) {
                    var p = this.canvas.getItem(this.shapes[i].points[j].name, this.shapes[i].name);
                    p && points.push(p);
                }
                break;
            }
        }
        if (points.length > 0) {
            for (var i = 0; i < points.length; i++) {
                points[i].set({
                    radius: 10
                });
            }
            this.canvas.renderAll();
        }
    }
    vcanvas.prototype.textChange = function (id) {
        var element = document.getElementById(id);
        var oldvalue = element.defaultValue;
        var newValue = element.value;
        var isExsit = false;
        if (newValue !== oldvalue) {
            var obj = this.Get(newValue);
            if (obj) {
                isExsit = true;
            }
            if (!isExsit) {
                var object = this.Get(oldvalue);
                if (object) {
                    var newShape = object.Rename(newValue);
                    this.triggerHandler('CanvasModified', {
                        event: "rename",
                        source: newShape
                    });
                    this.Remove(object);
                    this.shapes.push(newShape);
                    element.defaultValue = newValue;
                }
            } else {
                alert("Name already exsit !");
                element.value = oldvalue;
            }
        }
    }
    vcanvas.prototype.ValidateKey = function () {
        var key = window.event.keyCode;
        var allowed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-.0123456789';
        return allowed.indexOf(String.fromCharCode(key)) != -1;
    }
    vcanvas.prototype.ValidateNumber = function () {
        var key = window.event.keyCode;
        var allowed = '0123456789';
        return allowed.indexOf(String.fromCharCode(key)) != -1;
    }
    vcanvas.prototype.replacer = function (key, value) {
        // console.log(key, value);
        if (replaceValues.indexOf(value) > -1 || replaceValues.indexOf(key) > -1)
            return undefined;
        else
            return value;
    };
    vcanvas.prototype.ToJson = function () {
        var temp = Object.assign({}, this);
        this.RemoveProperties(temp);
        var ExportObject = {};
        ExportObject.types = this.types;
        ExportObject.backgroundUrl = this.backgroundUrl;
        ExportObject.extColumns = this.extColumns;
        ExportObject.maxShape = this.maxShape;
        ExportObject.shapes = [];
        ExportObject.randomColor = this.randomColor;
        var extendColumns = this.extColumns;
        var image = this.background;
        var mother = this;
        this.shapes.forEach(function (shape) {
            var ShapeExportObj = {};
            extendColumns.forEach(function (column) {
                ShapeExportObj[column.name] = shape[column.name] ? shape[column.name] : null;
            });
            ShapeExportObj.name = shape.name;
            ShapeExportObj.type = shape.type;
            ShapeExportObj.points = [];
            ShapeExportObj.middlePoints = [];
            ShapeExportObj.readOnly = shape.readOnly;
            ShapeExportObj.viewOnly = shape.viewOnly;
            if (shape.type == types.Text) {
                var obj = mother.canvas.getItem(shape.name, null);
                var bound = obj.getBoundingRect();
                ShapeExportObj.left = parseFloat(shape.lbX / image.width).toFixed(2);
                ShapeExportObj.top = parseFloat((shape.lbY + bound.height) / image.height).toFixed(2);
            }
            shape.points.forEach(function (point) {
                ShapeExportObj.points.push({
                    index: point.index,
                    name: point.name,
                    left: parseFloat(point.left / image.width).toFixed(2),
                    top: parseFloat(point.top / image.height).toFixed(2)
                });
            });
            shape.middlePoints.forEach(function (point) {
                ShapeExportObj.middlePoints.push({
                    index: point.index,
                    name: point.name,
                    left: parseFloat(point.left / image.width).toFixed(2),
                    top: parseFloat(point.top / image.height).toFixed(2)
                });
            });
            ExportObject.shapes.push(ShapeExportObj);
        });
        var js = JSON.stringify(ExportObject);
        return js;
    }
    vcanvas.prototype.RemoveProperties = function (obj) {
        replaceValues.push('background', 'ActiveObject', 'isDrawing', 'tempPoint', 'units', 'startX',
            'startY', 'LineHovered', 'prevSelected', 'js', 'url', 'panning', 'isMouseDown', 'AddPointMode',
            'isMoving', 'color', 'parentName', 'AddPointMode', 'lines', 'lbX', 'lbY', 'radius', 'fill', 'stroke', 'lockMovementX',
            'lockMovementY', 'canvas', 'x', 'y', 'parentObject');
    }
    vcanvas.prototype.Add = function (params) {
        var properties = $.extend({
            name: null,
            type: null,
        }, params);
        var name = properties.name;
        var type = properties.type;

        var result = this.randomName(type);
        var newShape = new Shape({
            name: result.name,
            canvas: this.canvas
        });
        if (type == types.Rect) {
            newShape.Rect();
        } else if (type == types.VLine) {
            newShape.VerticalLine();
        } else if (type == types.HLine) {
            newShape.HorizontalLine();
        } else if (type == types.Text) {
            newShape.Text();
        } else if (type == types.TwoAreaRectH) {
            newShape.TwoAreaRectHorizontal();
        } else if (type == types.TwoAreaRectV) {
            newShape.TwoAreaRectVertical();
        }
        if (!this.randomColor) {
            if (type == types.Rect) newShape.color = colors.Rect;
            if (type == types.VLine) newShape.color = colors.VerticalLine;
            if (type == types.HLine) newShape.color = colors.HorizontalLine;
            if (type == types.Line) newShape.color = colors.Line;
            if (type == types.Text) newShape.color = colors.Text;
            if (type == types.TwoAreaRectH) newShape.color = colors.TwoAreaRectH;
            if (type == types.TwoAreaRectV) newShape.color = colors.TwoAreaRectV;
        }
        newShape.Draw({
            scaleFactor: globalScaleValue,
            strokeWidth: globalStrokeWidth
        });
        this.shapes.push(newShape);
        this.loadDataToTable();
        this.triggerHandler("CanvasModified", {
            event: `AddShape`,
            source: newShape
        });
    };
    vcanvas.prototype.Get = function (object) {
        var shape;
        if (typeof object == 'string' || object instanceof String) {
            this.shapes.forEach(function (s) {
                if (s.name === object) {
                    shape = s;
                }
            });
        }

        return shape;
    };
    vcanvas.prototype.randomName = function (type) {
        var lstName = [];
        var name;
        var isExsit = true;
        var i = 1;
        var index = 1;
        this.shapes.forEach(function (o) {
            index++;
            if (type == o.type)
                lstName.push(o.name);
        });

        while (isExsit) {
            if (type === types.Line)
                name = "Line-" + i;
            else if (type === types.VLine)
                name = "VLine-" + i;
            else if (type === types.HLine)
                name = "HLine-" + i;
            else if (type === types.Text)
                name = "Text-" + i;
            else if (type == types.Rect)
                name = "Rect-" + i;
            else if (type == types.TwoAreaRectV)
                name = "VRect-" + i;
            else if (type == types.TwoAreaRectH)
                name = "HRect-" + i;
            if (lstName.indexOf(name) == -1) {
                isExsit = false;
            } else {
                ++i;
            }
        }
        return {
            name: name,
            index: index
        };
    };
    vcanvas.prototype.getItem = function (name, parentName) {
        var object = null,
            objects = this.canvas.getObjects();
        var os = [];
        for (var i = 0, len = this.canvas.size(); i < len; i++) {
            if (parentName) {
                if (name) {
                    if (objects[i].name && objects[i].name === name && objects[i].parentName === parentName) {
                        object = objects[i];
                        break;
                    }
                } else {
                    if (objects[i].parentName === parentName) {
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
    vcanvas.prototype.LoadBackground = function (params) {
        var properties = $.extend({
            url: this.backgroundUrl,
            reloadAll: false
        }, params);
        var reloadAll = properties.reloadAll;
        var bgr = new Background();
        var mother = this;
        this.backgroundUrl = properties.url;
        bgr.url = this.backgroundUrl;
        var bgImg = this.canvas.getItem('background', null);
        var oldImgWidth = null;
        var oldImgHeight = null;
        if (bgImg) {
            oldImgWidth = bgImg.width;
            oldImgHeight = bgImg.height;
            mother.canvas.remove(bgImg);
        }

        fabric.Image.fromURL(properties.url, function (img) {
            img.selectable = false;
            img.set({
                name: 'background',
                left: 0,
                top: 0
            });
            mother.canvas.add(img);
            mother.canvas.sendToBack(img)
            if (img.height > 0 && img.width > 0) {
                globalImageHeight = img.height;
                bgr.height = img.height;
                globalImageWidth = img.width;
                bgr.width = img.width;
                if (reloadAll) {
                    if (globalImageHeight > 0 && globalImageWidth > 0) {
                        //console.log(globalImageHeight, globalImageWidth);
                        mother.shapes.forEach(function (shape) {
                            shape.points.forEach(function (point) {
                                var leftInPercent = (point.left / oldImgWidth); //* 100;
                                var topInPercent = (point.top / oldImgHeight); //* 100;
                                point.left = (leftInPercent * bgr.width); /// 100;
                                point.top = (topInPercent * bgr.height); // 100;
                            })
                            shape.lbX = null;
                            shape.lbY = null;
                            shape.Remove();
                            shape.Draw();
                        })
                    }
                }

                this.background = bgr;
            }
            // if(img.height)
            //     c.setDimensions({height: img.height, width:img.width});
            // c.setZoom(0.51);
            //c.setBackgroundImage(img, c.renderAll.bind(c));
            mother.canvas.renderAll();
        });

    };
    vcanvas.prototype.Remove = function (object) {
        var o = this.Get(object);
        if (typeof object == 'string' || object instanceof String) {
            o.Remove();
            this.shapes.splice(this.shapes.indexOf(o), 1);
        } else {
            o.Remove();
            this.shapes.splice(this.shapes.indexOf(object), 1);
        }
        this.loadDataToTable();
        this.triggerHandler('CanvasModified', {
            event: "remove",
            source: this
        });
    };
    return vcanvas;
}());
var Background = (function () {
    function Background(params) {
        var properties = $.extend({
            url: null,
            width: 0,
            height: 0,
        }, params);
        this.url = properties.url;
        this.width = properties.width;
        this.height = properties.height;
    }
    return Background;
}());
var Point = /** @class */ (function () {
    function Point(params) {
        var properties = $.extend({
            //these are the defaults
            index: null,
            name: null,
            parentName: null,
            left: 0,
            top: 0,
            fill: null,
            stroke: null,
            lockMovementX: false,
            lockMovementY: false,
            canvas: null,
            readOnly: false,
            viewOnly: false,
            middlePoint: false,
            middleStartPoint: null,
            middleEndPoint: null,
            XRatio: null, //ty le cua diem nam giua so vs canh tren truc OX
            YRatio: null //ty le cua diem nam giua so vs canh tren truc OY
        }, params);
        this.index = properties.index;
        this.name = properties.name;
        this.parentName = properties.parentName;
        this.left = properties.left;
        this.top = properties.top;
        this.fill = properties.fill;
        this.stroke = properties.stroke;
        this.lockMovementX = properties.lockMovementX;
        this.lockMovementY = properties.lockMovementY;
        this.canvas = properties.canvas;
        this.readOnly = properties.readOnly;
        this.viewOnly = properties.viewOnly;
        this.middlePoint = properties.middlePoint;
        this.XRatio = properties.XRatio;
        this.YRatio = properties.YRatio;
        this.middleStartPoint = properties.middleStartPoint;
        this.middleEndPoint = properties.middleEndPoint;
    }
    Point.prototype.Draw = function (params) {
        var options = $.extend({
            canvas: null,
            scaleFactor: null,
            readOnly: false,
            viewOnly: false
        }, params);
        var c = options.canvas;
        var scaleFactor = options.scaleFactor;
        this.readOnly = options.readOnly;
        this.viewOnly = options.viewOnly;
        var p = new fabric.Circle({
            left: this.left,
            top: this.top,
            fill: this.fill,
            radius: 10,
            strokeWidth: 1,
            stroke: "black",
            name: this.name,
            parentName: this.parentName,
            XRatio: this.XRatio,
            YRatio: this.YRatio,
            middleRatio: this.middleRatio,
            hoverCursor: "pointer",
            selectable: !this.readOnly,
            middlePoint: this.middlePoint,
            middleEndPoint: this.middleEndPoint,
            middleStartPoint: this.middleStartPoint
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
        var properties = $.extend({
            //these are the defaults
            name: null,
            type: types.Rect,
            points: [],
            middlePoints: [],
            color: '#' + getRandomColor(),
            isMoving: false,
            lbX: 0,
            lbY: 0,
            AddPointMode: false,
            canvas: null,
            readOnly: false,
            viewOnly: false
        }, params);
        this.name = properties.name;
        this.type = properties.type;
        this.points = properties.points;
        this.color = properties.color;
        this.isMoving = properties.isMoving;
        this.canvas = properties.canvas;
        this.readOnly = properties.readOnly;
        this.viewOnly = properties.viewOnly;
        this.middlePoints = properties.middlePoints;
    };
    Shape.prototype.DrawLabel = function (params) {
        var options = $.extend({
            data: null,
            scaleFactor: null
        }, params);
        var data = options.data;
        var scaleFactor = options.scaleFactor;

        if (!this.lbX && !this.lbY && this.type != types.Text) {
            for (var i = 0; i < this.points.length; i++) {
                if (this.points[i].name == "P-1") {
                    this.lbX = this.points[i].left - 5;
                    this.lbY = this.points[i].top - 50;
                    break;
                }
            }
        }
        var context = '';
        if (data && this.type != types.Text) context = this.name + '( ' + data + ' )';
        else context = this.name;
        var label = new fabric.IText(context, {
            name: this.type == types.Text ? this.name : "lb-" + this.name,
            parentName: this.type == types.Text ? null : this.name,
            left: this.lbX,
            top: this.lbY,
            fontSize: 40,
            fontFamily: "calibri",
            fill: this.color,
            stroke: 'black',
            strokeWidth: this.type == types.Text ? 1 : 0.5,
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
    };
    Shape.prototype.Rect = function () {
        this.type = types.Rect;

        var p1 = new Point({
            index: 0,
            name: "P-1",
            parentName: this.name,
            left: GetValueFromPercent(0.1, globalImageWidth), //175
            top: GetValueFromPercent(0.1, globalImageHeight), //175
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly
        });
        var p2 = new Point({
            index: 1,
            name: "P-2",
            parentName: this.name,
            left: GetValueFromPercent(0.15, globalImageWidth), //350
            top: GetValueFromPercent(0.10, globalImageHeight), //175
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly
        });
        var p3 = new Point({
            index: 2,
            name: "P-3",
            parentName: this.name,
            left: GetValueFromPercent(0.15, globalImageWidth), //350
            top: GetValueFromPercent(0.20, globalImageHeight), //300
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly
        });
        var p4 = new Point({
            index: 3,
            name: "P-4",
            parentName: this.name,
            left: GetValueFromPercent(0.10, globalImageWidth),
            top: GetValueFromPercent(0.20, globalImageHeight),
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly
        });
        this.points = [p1, p2, p3, p4];
    }

    Shape.prototype.TwoAreaRectHorizontal = function () {
        this.type = types.TwoAreaRectH;
        var p1 = new Point({
            index: 0,
            name: "P-1",
            parentName: this.name,
            left: GetValueFromPercent(0.1, globalImageWidth), //175
            top: GetValueFromPercent(0.1, globalImageHeight), //175
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly
        });
        var p2 = new Point({
            index: 1,
            name: "P-2",
            parentName: this.name,
            left: GetValueFromPercent(0.15, globalImageWidth), //350
            top: GetValueFromPercent(0.10, globalImageHeight), //175
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly
        });
        var p3 = new Point({
            index: 2,
            name: "P-3",
            parentName: this.name,
            left: GetValueFromPercent(0.15, globalImageWidth), //350
            top: GetValueFromPercent(0.20, globalImageHeight), //300
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly
        });
        var p4 = new Point({
            index: 3,
            name: "P-4",
            parentName: this.name,
            left: GetValueFromPercent(0.10, globalImageWidth),
            top: GetValueFromPercent(0.20, globalImageHeight),
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly
        });

        var middlePoint1 = new Point({
            index: 4,
            name: "MP-1",
            parentName: this.name,
            left: (p1.left + p4.left) / 2,
            top: (p1.top + p4.top) / 2,
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly,
            middlePoint: true
        });

        var middlePoint2 = new Point({
            index: 5,
            name: "MP-2",
            parentName: this.name,
            left: (p2.left + p3.left) / 2,
            top: (p2.top + p3.top) / 2,
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly,
            middlePoint: true,
        });

        this.middlePoints = [middlePoint1, middlePoint2];
        this.points = [p1, p2, p3, p4];
    }

    Shape.prototype.TwoAreaRectVertical = function () {
        this.type = types.TwoAreaRectV;
        var p1 = new Point({
            index: 0,
            name: "P-1",
            parentName: this.name,
            left: GetValueFromPercent(0.1, globalImageWidth), //175
            top: GetValueFromPercent(0.1, globalImageHeight), //175
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly
        });
        var p2 = new Point({
            index: 1,
            name: "P-2",
            parentName: this.name,
            left: GetValueFromPercent(0.15, globalImageWidth), //350
            top: GetValueFromPercent(0.10, globalImageHeight), //175
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly
        });
        var p3 = new Point({
            index: 2,
            name: "P-3",
            parentName: this.name,
            left: GetValueFromPercent(0.15, globalImageWidth), //350
            top: GetValueFromPercent(0.20, globalImageHeight), //300
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly
        });
        var p4 = new Point({
            index: 3,
            name: "P-4",
            parentName: this.name,
            left: GetValueFromPercent(0.10, globalImageWidth),
            top: GetValueFromPercent(0.20, globalImageHeight),
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly
        });

        var middlePoint1 = new Point({
            index: 4,
            name: "MP-1",
            parentName: this.name,
            left: (p1.left + p2.left) / 2,
            top: (p1.top + p2.top) / 2,
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly,
            middlePoint: true,
        });

        var middlePoint2 = new Point({
            index: 5,
            name: "MP-2",
            parentName: this.name,
            left: (p3.left + p4.left) / 2,
            top: (p3.top + p4.top) / 2,
            fill: this.color,
            stroke: this.color,
            canvas: this.canvas,
            readOnly: this.readOnly,
            viewOnly: this.viewOnly,
            middlePoint: true,
        });

        this.middlePoints = [middlePoint1, middlePoint2];
        this.points = [p1, p2, p3, p4];
    }

    Shape.prototype.VerticalLine = function () {
        this.type = types.VLine,
            this.points = [
                new Point({
                    index: 0,
                    name: "P-1",
                    parentName: this.name,
                    left: GetValueFromPercent(0.10, globalImageWidth),
                    top: GetValueFromPercent(0.10, globalImageHeight),
                    fill: this.color,
                    stroke: this.color,
                    lockMovementX: true,
                    canvas: this.canvas,
                    readOnly: this.readOnly,
                    viewOnly: this.viewOnly
                }),
                new Point({
                    index: 1,
                    name: "P-2",
                    parentName: this.name,
                    left: GetValueFromPercent(0.10, globalImageWidth),
                    top: GetValueFromPercent(0.35, globalImageHeight),
                    fill: this.color,
                    stroke: this.color,
                    lockMovementX: true,
                    canvas: this.canvas,
                    readOnly: this.readOnly,
                    viewOnly: this.viewOnly
                })
            ];
    }
    Shape.prototype.HorizontalLine = function () {
        this.type = types.HLine;
        this.points = [
            new Point({
                index: 0,
                name: "P-1",
                parentName: this.name,
                left: GetValueFromPercent(0.10, globalImageWidth),
                top: GetValueFromPercent(0.10, globalImageHeight),
                fill: this.color,
                stroke: this.color,
                lockMovementY: true,
                canvas: this.canvas,
                readOnly: this.readOnly,
                viewOnly: this.viewOnly
            }),
            new Point({
                index: 1,
                name: "P-2",
                parentName: this.name,
                left: GetValueFromPercent(0.35, globalImageWidth),
                top: GetValueFromPercent(0.10, globalImageHeight),
                fill: this.color,
                stroke: this.color,
                lockMovementY: true,
                canvas: this.canvas,
                readOnly: this.readOnly,
                viewOnly: this.viewOnly
            })
        ];
    }
    Shape.prototype.Text = function () {
        this.type = types.Text;
        this.lbX = GetValueFromPercent(0.15, globalImageWidth);
        this.lbY = GetValueFromPercent(0.20, globalImageHeight);
    }
    Shape.prototype.Draw = function (params) {
        var options = $.extend({
            scaleFactor: null,
            strokeWidth: null
        }, params);
        var scaleFactor = options.scaleFactor;
        var strokeWidth = options.strokeWidth;
        var dlines = {};
        var data = '';
        if (ExtendOtions.length > 0) { //add external properties of shape on label
            for (var i = 0; i < ExtendOtions.length; i++) {
                var temp = this[ExtendOtions[i].name];
                if (temp) {
                    if (i == (ExtendOtions.length - 1)) {
                        data += ExtendOtions[i].name + ':' + temp;
                    } else {
                        data += ExtendOtions[i].name + ':' + temp + '; ';
                    }
                }
            }
        }
        if (this.type != types.Text) {
            this.DrawLabel({
                data: data,
                scaleFactor: scaleFactor
            });
            if (this.type == types.Line) {
                var line = new fabric.Line([
                    this.points[0].left,
                    this.points[0].top,
                    this.points[1].left,
                    this.points[1].top
                ], {
                    name: this.name,
                    parentName: this.name,
                    fill: this.color,
                    stroke: this.color,
                    originX: 'center',
                    originY: 'center',
                    selectable: !this.readOnly,
                    viewOnly: this.viewOnly,
                    perPixelTargetFind: true
                });
                if (strokeWidth) {
                    line.strokeWidth = strokeWidth;
                } else {
                    line.strokeWidth = 3;
                }
                this.lines = [line.name];
                dlines[line.name] = line;
                this.canvas.add(line);
            } else if (this.type == types.VLine || this.type == types.HLine) {
                var line = new fabric.Line([
                    this.points[0].left,
                    this.points[0].top,
                    this.points[1].left,
                    this.points[1].top
                ], {
                    name: this.name,
                    parentName: this.name,
                    fill: this.color,
                    stroke: this.color,
                    originX: 'center',
                    originY: 'center',
                    selectable: false
                });
                if (strokeWidth) {
                    line.strokeWidth = globalStrokeWidth;
                } else {
                    line.strokeWidth = 3;
                }
                this.lines = [line.name];
                dlines[line.name] = line;
                this.canvas.add(line);
            } else {
                for (var i = 0; i < this.points.length; i++) {
                    var line;

                    this.FillInside();
                    if (i !== (this.points.length - 1)) {
                        line = new fabric.Line([
                            this.points[i].left,
                            this.points[i].top,
                            this.points[i + 1].left,
                            this.points[i + 1].top
                        ], {
                            name: "line" + i,
                            parentName: this.name,
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
                            parentName: this.name,
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
                var arrLine = [];
                Object.keys(dlines).forEach(function (key) {
                    var value = dlines[key].name;
                    arrLine.push(value);
                });
                this.lines = arrLine;
            }

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
            if (this.middlePoints.length > 0) {
                line = new fabric.Line([
                    this.middlePoints[0].left,
                    this.middlePoints[0].top,
                    this.middlePoints[1].left,
                    this.middlePoints[1].top
                ], {
                    name: "Mline",
                    parentName: this.name,
                    fill: this.color,
                    stroke: this.color,
                    selectable: false,
                    hasControls: false,
                    hasBorders: false,
                    hasRotatingPoint: false,
                    hoverCursor: this.hoverCursor,
                    perPixelTargetFind: true
                });
                if (globalStrokeWidth) {
                    line.strokeWidth = globalStrokeWidth;
                } else {
                    line.strokeWidth = 3;
                }
                dlines[line.name] = line;
                this.canvas.add(line);
                this.middlePoints.forEach(middlePoint => {
                    middlePoint.hoverCursor = this.hoverCursor;
                    middlePoint.fill = this.color;
                    middlePoint.Draw({
                        canvas: this.canvas,
                        scaleFactor: scaleFactor,
                        readOnly: this.readOnly,
                        viewOnly: this.viewOnly
                    });
                });
            }
        } else {
            this.DrawLabel({
                scaleFactor: scaleFactor,
                data: data
            });
        }


    };
    Shape.prototype.Move = function (params) {
        var properties = $.extend({
            //these are the defaults
            offsetX: 0,
            offsetY: 0,
            point: null,
            scaleFactor: null,
            strokeWidth: null
        }, params);
        var offsetX = properties.offsetX;
        var offsetY = properties.offsetY;
        if (offsetX < 0 || offsetY < 0) {
            var test = 1;
        }
        var point = properties.point;
        var scaleFactor = properties.scaleFactor;
        var strokeWidth = properties.strokeWidth;
        if (this.type != types.Text) {
            this.Remove();
            if (point) {
                if (point.middlePoint) {
                    if (this.type == types.TwoAreaRectH) {
                        if (point.name == 'MP-1') {
                            var result = this.checkLineIntersection(this.middlePoints[1].left, this.middlePoints[1].top, point.left, point.top, this.points[0].left, this.points[0].top, this.points[3].left, this.points[3].top);
                            if (result.onLine1 && result.onLine2) {
                                var result2 = this.checkLineIntersection(result.x, result.y, this.middlePoints[1].left, result.y, this.points[1].left, this.points[1].top, this.points[2].left, this.points[2].top);
                                if (result2.onLine2) {
                                    this.middlePoints[1].left = result2.x;
                                    this.middlePoints[1].top = result.y;

                                    this.middlePoints[0].left = result.x;
                                    this.middlePoints[0].top = result.y;
                                }
                            }

                        } else if (point.name == 'MP-2') {
                            var result = this.checkLineIntersection(this.middlePoints[0].left, this.middlePoints[0].top, point.left, point.top, this.points[1].left, this.points[1].top, this.points[2].left, this.points[2].top);
                            if (result.onLine1 && result.onLine2) {
                                this.middlePoints[1].left = result.x;
                                this.middlePoints[1].top = result.y;

                                this.middlePoints[0].top = result.y;
                                var result2 = this.checkLineIntersection(this.middlePoints[0].left, this.middlePoints[0].top, this.middlePoints[1].left, result.y, this.points[0].left, this.points[0].top, this.points[3].left, this.points[3].top);
                                if (result2.onLine2) {
                                    this.middlePoints[0].left = result2.x;
                                }
                            }
                        }

                    } else if (this.type == types.TwoAreaRectV) {
                        if (point.name == 'MP-1') {
                            var result = this.checkLineIntersection(this.middlePoints[1].left, this.middlePoints[1].top, point.left, point.top, this.points[0].left, this.points[0].top, this.points[1].left, this.points[1].top);

                            if (result.onLine1 && result.onLine2) {
                                var result2 = this.checkLineIntersection(result.x, result.y, result.x, this.middlePoints[1].top, this.points[2].left, this.points[2].top, this.points[1].left, this.points[1].top);
                                if (result2.onLine2) {
                                    this.middlePoints[0].left = result.x;
                                    this.middlePoints[0].top = result.y;

                                    this.middlePoints[1].left = result2.x;
                                    this.middlePoints[1].top = result.y;
                                }
                            }
                        } else if (point.name == 'MP-2') {
                            var result = this.checkLineIntersection(this.middlePoints[0].left, this.middlePoints[0].top, point.left, point.top, this.points[3].left, this.points[3].top, this.points[2].left, this.points[2].top);

                            if (result.onLine1 && result.onLine2) {
                                var result2 = this.checkLineIntersection(result.x, result.y, result.x, this.middlePoints[1].top, this.points[0].left, this.points[0].top, this.points[1].left, this.points[1].top);
                                if (result2.onLine2) {
                                    this.middlePoints[1].left = result.x;
                                    this.middlePoints[1].top = result.y;

                                    this.middlePoints[0].left = result.x;
                                    this.middlePoints[0].top = result2.y;
                                }
                            }
                        }
                    }
                } else {
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
                    if (this.middlePoints.length > 0) {
                        var result = this.CaculateMiddlePoints();
                        if (!result) {
                            for (var i = 0; i < this.points.length; i++) {
                                if (point.name === this.points[i].name) {
                                    this.points[i].left = originPoint.left;
                                    this.points[i].top = originPoint.top;
                                    break;
                                }
                            }
                        }
                    }
                    this.lbX = this.points[0].left + 5;
                    this.lbY = this.points[0].top - 30;

                }
            } else {
                this.GetNewCoodr(offsetX, offsetY);
            }
            this.Draw({
                scaleFactor: scaleFactor,
                strokeWidth: strokeWidth
            });
        } else {
            this.lbX = offsetX;
            this.lbY = offsetY;
            this.Remove();
            this.Draw({
                scaleFactor: scaleFactor,
                strokeWidth: strokeWidth
            });
        }
    }

    Shape.prototype.CaculateMiddlePoints = function () {
        var MiddleLine = [];
        MiddleLine.push({
            x: this.middlePoints[0].left,
            y: this.middlePoints[0].top
        }, {
            x: this.middlePoints[1].left,
            y: this.middlePoints[1].top
        });
        if (this.type == types.TwoAreaRectH) {
            var result1 = this.checkLineIntersection(MiddleLine[0].x, MiddleLine[0].y, MiddleLine[1].x, MiddleLine[1].y, this.points[0].left, this.points[0].top, this.points[3].left, this.points[3].top);
            if (result1.onLine2) {
                this.middlePoints[0].left = result1.x;
                this.middlePoints[0].top = result1.y;
            } else {
                return false;
            }

            var result2 = this.checkLineIntersection(MiddleLine[0].x, MiddleLine[0].y, MiddleLine[1].x, MiddleLine[1].y, this.points[1].left, this.points[1].top, this.points[2].left, this.points[2].top);
            if (result2.onLine2) {
                this.middlePoints[1].left = result2.x;
                this.middlePoints[1].top = result2.y;
            } else {
                return false;
            }
        }
        if (this.type == types.TwoAreaRectV) {
            var result1 = this.checkLineIntersection(MiddleLine[0].x, MiddleLine[0].y, MiddleLine[1].x, MiddleLine[1].y, this.points[0].left, this.points[0].top, this.points[1].left, this.points[1].top);
            if (result1.onLine2) {
                this.middlePoints[0].left = result1.x;
                this.middlePoints[0].top = result1.y;
            } else {
                return false;
            }

            var result2 = this.checkLineIntersection(MiddleLine[0].x, MiddleLine[0].y, MiddleLine[1].x, MiddleLine[1].y, this.points[2].left, this.points[2].top, this.points[3].left, this.points[3].top);
            if (result2.onLine2) {
                this.middlePoints[1].left = result2.x;
                this.middlePoints[1].top = result2.y;
            } else {
                return false;
            }
        }
        return true;

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
            parentName: this.name,
            opacity: 0.01,
            hasControls: false,
            hasBorders: false,
            hasRotatingPoint: false,
            selectable: !this.readOnly,
            viewOnly: this.viewOnly
        });
        if (this.type === types.Rect || this.type === types.Line) {
            path.set({
                perPixelTargetFind: true
            });
        }
        // if (this.type === "line" || this.type === "verticalLine" || this.type === "horizontalLine"){
        //     path.set({strokeWidth: 5});    

        // }
        this.canvas.add(path);
    };
    Shape.prototype.Rename = function (newName) {
        var oldName = this.name;
        this.name = newName;
        if (this.type != types.Text) {
            for (var i = 0; i < this.points.length; i++) {
                this.points[i].parentName = newName;
                var p = this.canvas.getItem(this.points[i].name, oldName);
                this.canvas.remove(p);
            }
            for (var j = 0; j < this.lines.length; j++) {
                var line = this.canvas.getItem(this.lines[j], oldName);
                this.canvas.remove(line);
            }
            var label = this.canvas.getItem("lb-" + oldName);
            this.canvas.remove(label);
        } else {
            var lb = this.canvas.getItem(oldName);
            this.canvas.remove(lb);
        }

        this.Draw({
            scaleFactor: globalScaleValue,
            strokeWidth: globalStrokeWidth
        });
        return this;
    };
    Shape.prototype.AddPoint = function (p) {
        this.AddPointMode = true;
        var dmin = Math.sqrt((p.top - this.points[0].top) * (p.top - this.points[0].top) + (p.left - this.points[0].left) * (p.left - this.points[0].left));
        var p1 = this.points[0];
        var p2;
        var lstPoint = [];
        this.points.forEach(function (p) {
            lstPoint.push(p);
        });
        var k = 1;
        while (k <= 2) {
            for (var i = 0; i < lstPoint.length; i++) {
                var d = Math.sqrt((p.top - lstPoint[i].top) * (p.top - lstPoint[i].top) + (p.left - lstPoint[i].left) * (p.left - lstPoint[i].left));
                if (d < dmin) {
                    dmin = d;
                    if (k !== 2)
                        p1 = lstPoint[i];
                    else
                        p2 = lstPoint[i];
                }
            }
            if (k === 1) {
                lstPoint.splice(lstPoint.indexOf(p1), 1);
                p2 = lstPoint[0];
                dmin = Math.sqrt((p.top - lstPoint[0].top) * (p.top - lstPoint[0].top) + (p.left - lstPoint[0].left) * (p.left - lstPoint[0].left));
            }
            k++;
        }
        var name, index;
        if (p1.index === this.points[0].index && p2.index === this.points[this.points.length - 1].index) {
            index = p2.index + 1;
            name = "P-" + (index + 1);
        } else if ((p1.index === this.points[this.points.length - 1].index) && (p2.index === this.points[0].index)) {
            index = p1.index + 1;
            name = "P-" + (index + 1);
        } else {
            if (p1.index < p2.index) {
                index = p2.index;
                name = "P-" + (index + 1);
                p2.index += 1;
                p2.name = "P-" + (p2.index + 1);
            } else {
                index = p1.index;
                name = "P-" + (index + 1);
                p1.index += 1;
                p1.name = "P-" + (p1.index + 1);

            }
            for (var i = (p1.index < p2.index) ? p2.index : p1.index; i <= (this.points.length - 1); i++) {
                this.points[i].index += 1;
                this.points[i].name = "P-" + (this.points[i].index + 1);
            }
        }


        p.name = name;
        p.index = index;
        p.parentName = this.name;
        p.fill = this.color;
        p.stroke = this.color;
        p.canvas = this.canvas;
        this.Remove();
        this.points.push(p);
        this.points.sort(this.compare);
        this.Draw({
            scaleFactor: globalScaleValue,
            strokeWidth: globalStrokeWidth
        });
        this.canvas.renderAll();
    };
    Shape.prototype.compare = function (a, b) {
        const indexA = a.index;
        const indexB = b.index;
        var comparison = 0;
        if (indexA > indexB) {
            comparison = 1;
        } else if (indexA < indexB) {
            comparison = -1;
        }
        return comparison;
    };
    Shape.prototype.Remove = function () {
        if (this.type == types.Text) {
            var obj = this.canvas.getItem(this.name, null);
            this.canvas.remove(obj);
        }
        var objs = this.canvas.getItem('', this.name);
        for (var i = 0; i < objs.length; i++) {
            this.canvas.remove(objs[i]);
        }
    };
    Shape.prototype.RemovePoint = function (name) {
        if (this.points.length === 3) {
            return;
        }
        var p;
        for (var i = 0; i < this.points.length; i++) {
            if (p) {
                if (p.index !== this.points.length) {
                    this.points[i].index -= 1;
                    this.points[i].name = "P-" + (this.points[i].index + 1);
                }
            }
            if (!p && this.points[i].name === name) {
                p = this.points[i];
            }
        }
        this.Remove();
        this.points.splice(this.points.indexOf(p), 1);
        this.Draw({
            scaleFactor: globalScaleValue,
            strokeWidth: globalStrokeWidth
        });
    }
    Shape.prototype.Convex = function () { //Kiem tra da giac loi
        var y1, y2;
        var totalAngle = 0;
        for (var i = 0; i < this.points.length; i++) {
            if (i === 0) {
                y1 = i + 1;
                y2 = this.points.length - 1;
            } else if (i === (this.points.length - 1)) {
                y1 = 0;
                y2 = i - 1;
            } else {
                y1 = i + 1;
                y2 = i - 1;
            }

            var a = Math.sqrt((this.points[i].top - this.points[y1].top) * (this.points[i].top - this.points[y1].top) +
                (this.points[i].left - this.points[y1].left) * (this.points[i].left - this.points[y1].left));
            var b = Math.sqrt((this.points[i].top - this.points[y2].top) * (this.points[i].top - this.points[y2].top) +
                (this.points[i].left - this.points[y2].left) * (this.points[i].left - this.points[y2].left));
            var c = Math.sqrt((this.points[y1].top - this.points[y2].top) * (this.points[y1].top - this.points[y2].top) +
                (this.points[y1].left - this.points[y2].left) * (this.points[y1].left - this.points[y2].left));
            var ang = Math.round(Math.acos((a * a + b * b - c * c) / (2 * a * b)) * (180 / Math.PI));
            totalAngle += ang;
        }
        if (totalAngle === ((this.points.length - 2) * 180)) {

            return true;
        } else {
            return false;
        }
        // var p2 =this.points[0];
        // this.points.forEach(function(p){ 
        //     if(p.top < p2.top){
        //         p2 = p; 
        //     }
        // });
        // var p = p2;
        // var i1,i3;
        // var type = "convex";
        // do{
        //     if(p2.index === 0){i3 = this.points.length - 1;}else{i3 = p2.index - 1;};
        //     if(p2.index === (this.points.length-1)){i1=0}else{i1=p2.index+1;};
        //     var p3 = this.points[i3];
        //     var p1 = this.points[i1];
        //     if(this.CCW(p1,p2,p3) === -1){
        //         p2 = p3;
        //     }else{
        //         type = "nonconvex";
        //         break;
        //     }
        // }while(p2.index !== p.index);
        // this.type = type;
    };
    Shape.prototype.Inside = function (p) { //kiem tra 1 diem co nam trong da giac
        var totalAngle = 0;
        var p1 = this.points[0];
        var i1, i2;
        for (var i = 0; i < this.points.length; i++) {
            var p1 = this.points[i];
            var p2;
            if (p1.index === this.points.length - 1) {
                p2 = this.points[0];
            } else {
                p2 = this.points[i + 1];
            }
            var a = Math.sqrt((p.top - p1.top) * (p.top - p1.top) + (p.left - p1.left) * (p.left - p1.left));
            var b = Math.sqrt((p.top - p2.top) * (p.top - p2.top) + (p.left - p2.left) * (p.left - p2.left));
            var c = Math.sqrt((p1.top - p2.top) * (p1.top - p2.top) + (p1.left - p2.left) * (p1.left - p2.left));
            var ang = Math.round(Math.acos((a * a + b * b - c * c) / (2 * a * b)) * (180 / Math.PI));
            totalAngle += ang;
        }
        if (totalAngle === 360) {
            return true;
        } else {
            return false;
        }
    };
    Shape.prototype.Centroid = function () { //tinh toa do trong tam
        var nPts = this.points.length;
        var x = 0;
        var y = 0;
        var f;
        var j = nPts - 1;
        var p1;
        var p2;

        for (var i = 0; i < nPts; j = i++) {
            p1 = this.points[i];
            p2 = this.points[j];
            f = p1.left * p2.top - p2.left * p1.top;
            x += (p1.left + p2.left) * f;
            y += (p1.top + p2.top) * f;
        }
        f = this.Area() * 6;
        return new Point("G", this.name, x / f, y / f, 5, this.color, 1, this.color, "", "", false, false, -2);
    };
    Shape.prototype.Area = function () { //tinh dien tich
        var area = 0;
        var nPts = this.points.length;
        var j = nPts - 1;
        var p1;
        var p2;
        for (var i = 0; i < nPts; j = i++) {
            p1 = this.points[i];
            p2 = this.points[j];
            area += p1.left * p2.top;
            area -= p1.top * p2.left;
        }
        area /= 2;

        return area;
    };
    Shape.prototype.CCW = function (p1, p2, p3) { //kiem tra doan thang p2p3 sang trai hay phai so vs doan p1p2 ; -1 sang trai, 1 sang phai, 0 thang hang
        var a1, b1, a2, b2, t;
        a1 = p2.left - p1.left;
        b1 = p2.top - p1.top;
        a2 = p3.left - p2.left;
        b2 = p3.top - p2.top;
        t = a1 * b2 - a2 * b1;
        if (Math.abs(t) < Number.EPSILON)
            return 0;
        else {
            if (t > 0)
                return 1;
            else
                return -1;
        }
    };
    Shape.prototype.Intersect = function (p1l1, p2l2, p1l2, p2l2) { //Check 2 duong thang cat nhau
        var a1, b1, c1, a2, b2, c2, t1, t2;
        var f1 = this.Extract(p1l1, p2l2);
        var f2 = this.Extract(p2l1, p2l2);
        a1 = f1.a;
        b1 = f1.b;
        c1 = f1.c;
        a2 = f2.a;
        b2 = f2.b;
        c2 = f2.c;
        t1 = (p1l1.left * a2 + p1l1.top * b2 + c2) * (p1l1.left * a2 + p2l1.top * b2 + c2);
        t2 = (p1l1.left * a1 + p1l1.top * b1 + c1) * (p2l1.left * a1 + p2l1.top * b1 + c1);
        return (t1 < Number.EPSILON && t2 < Number.EPSILON) ? true : false;
    };
    Shape.prototype.checkLineIntersection = function (line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
        // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
        var denominator, a, b, numerator1, numerator2, result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };
        denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
        if (denominator == 0) {
            return result;
        }
        a = line1StartY - line2StartY;
        b = line1StartX - line2StartX;
        numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
        numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        // if we cast these lines infinitely in both directions, they intersect here:
        result.x = line1StartX + (a * (line1EndX - line1StartX));
        result.y = line1StartY + (a * (line1EndY - line1StartY));
        /*
                // it is worth noting that this should be the same as:
                x = line2StartX + (b * (line2EndX - line2StartX));
                y = line2StartX + (b * (line2EndY - line2StartY));
                */
        // if line1 is a segment and line2 is infinite, they intersect if:
        if (a > 0 && a < 1) {
            result.onLine1 = true;
        }
        // if line2 is a segment and line1 is infinite, they intersect if:
        if (b > 0 && b < 1) {
            result.onLine2 = true;
        }
        // if line1 and line2 are segments, they intersect if both of the above are true
        return result;
    };
    Shape.prototype.GetPoint = function (name) {
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].name == name) {
                return this.points[i];
            }
        }
    }
    Shape.prototype.CalibRect = function () {
        var P3 = this.GetPoint("P-3");
        var P4 = this.GetPoint("P-4");
        var P2 = this.GetPoint("P-2");
        var P1 = this.GetPoint("P-1");
        var f_bottom = this.Extract(P3, P4);
        var f23 = this.Extract(P2, P3);
        var f12New = {
            a: f_bottom.a,
            b: f_bottom.b,
            c: -f_bottom.a * P1.left - f_bottom.b * P1.top
        };
        var NewP2 = this.CaculateIntersection(f23, f12New);
        P2.top = NewP2.y;
        P2.left = NewP2.x;
        // P2.left = vectoP3P4.y + P1.top;
        this.Remove();
        this.Draw({
            scaleFactor: globalScaleValue
        });
    };
    Shape.prototype.CaculateIntersection = function (f1, f2) {
        var d = f1.a * f2.b - f2.a * f1.b;
        var dx = f1.c * f2.b - f2.c * f1.b;
        var dy = f1.a * f2.c - f2.a * f1.c;
        var x0 = 0;
        var y0 = 0;
        if (d) {
            x0 = dx / d * -1;
            y0 = dy / d * -1;
        }
        return {
            x: x0,
            y: y0
        }
    }
    Shape.prototype.Extract = function (p1, p2) { //xay dung phuong trinh duong thang ax+by+c=0
        //y = ax + b
        // var a = (p2.top - p1.top)/(p2.left - p1.left);
        // var c = p1.top - a*p2.left;
        // return{
        //     a:a,
        //     b:1,
        //     c:c
        // }
        var u = {
            x: p2.left - p1.left,
            y: p2.top - p1.top
        };
        var a = u.y;
        var b = -u.x;
        var c = -(a * p1.left + b * p1.top);
        return {
            a: a,
            b: b,
            c: c
        };
    };
    Shape.prototype.GetNewCoodr = function (a, b) { //tinh lai toa do khi di chuyen
        for (var i = 0; i < this.points.length; ++i) {
            this.points[i].left += a;
            this.points[i].top += b;
        }
        for (var j = 0; j < this.middlePoints.length; j++) {
            this.middlePoints[j].left += a;
            this.middlePoints[j].top += b;
        }
        this.lbX += a;
        this.lbY += b;
    };
    return Shape;
}());
vcanvas.prototype.getItem = function (name, parentName) {
    var object = null,
        objects = this.canvas.getObjects();
    var os = [];
    for (var i = 0, len = this.canvas.size(); i < len; i++) {
        if (parentName) {
            if (name) {
                if (objects[i].name && objects[i].name === name && objects[i].parentName === parentName) {
                    object = objects[i];
                    break;
                }
            } else {
                if (objects[i].parentName === parentName) {
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
fabric.Canvas.prototype.getItem = function (name, parentName) {
    var object = null,
        objects = this.getObjects();
    var os = [];
    for (var i = 0, len = this.size(); i < len; i++) {
        if (parentName) {
            if (name) {
                if (objects[i].name && objects[i].name === name && objects[i].parentName === parentName) {
                    object = objects[i];
                    break;
                }
            } else {
                if (objects[i].parentName === parentName) {
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

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function GetPercent(value, total) {
    return parseFloat(value / total);
}

function GetValueFromPercent(value, total) {
    return parseFloat(value * total);
}