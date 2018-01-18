(function () {
    var canvasCollection = [];
    function Create(params) {
        var properties = $.extend({
            json: null,
            parent: null,
            backgroundUrl: null,
            type: null
        }, params);
        var json = properties.json;
        var parentId = properties.parent;
        var backgroundUrl = properties.backgroundUrl;
        var type = properties.type;
        var newCanvas = new vcanvas({ id: GenerateId(), type: type, parent: parentId, backgroundUrl: backgroundUrl, js: json });
        canvasCollection.push(newCanvas);
        return newCanvas.id;
    }
    function GenerateId() {
        var index = 0;
        canvasCollection.forEach(function (obj) {
            index++;
        });
        return `vcanvas-${index}`;
    }

    myCanvas = {
        Create: Create,
        GenerateId: GenerateId,
        canvasCollection: canvasCollection
    };
})();
var vcanvas = /** @class */ (function () {
    var replaceValues = [];
    function vcanvas(params) {
        var properties = $.extend({
            //these are the defaults
            id: null,
            parent: null,
            type: null,
            backgroundUrl: null,
            Shapes: [],
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
            js: null
        }, params);
        this.id = properties.id;
        this.parent = properties.parent; //id, ex: <div id='containner'>
        this.type = properties.type;
        this.backgroundUrl = properties.backgroundUrl;
        this.Shapes = properties.Shapes;
        this.units = properties.units;
        this.startX = properties.startX;
        this.startY = properties.startY;
        this.tempPoint = properties.tempPoint;
        this.LineHovered = properties.LineHovered;
        this.ActiveObject = properties.ActiveObject;
        this.prevSelected = properties.prevSelected;
        this.js = properties.js;

        this.init(this.js);
    }
    vcanvas.prototype.initId = function () {
        this.bgModalId = this.id + '-modal';
        this.txtImgUrlId = this.id + '-txtImgUrl';
        this.modalErrorId = this.id + '-modalError';
        this.btnChangeBackgroundSaveId = this.id + '-btnChangeBackgroundSave';
        this.btnAddRectId = this.id + '-btnAddRect';
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
        this.tableWrapperId = this.id + '-tableWrapper';
        replaceValues.push('canvas', this.bgModalId, this.txtImgUrlId, this.modalErrorId,this.btnChangeBackgroundSaveId,
        this.btnAddRectId, this.btnAddVerticalLineId, this.btnAddHorizontalLineId, this.btnDrawLineId, this.btnZoomInId,
        this.btnZoomOutId, this.btnResetZoomId,this.btnAddBackgroundId, this.btnExportId, this.lblNoteId, this.txtNameId,
        this.txtDataId, this.wrapperId, this.canvasId, this.tableId, this.tableWrapperId);
    }
    vcanvas.prototype.initCss = function () {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `#${this.wrapperId}{ overflow:hidden; }
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
        if (json) {
            this.Shapes = [];
            var RawData = JSON.parse(json);
            this.backgroundUrl = RawData.backgroundUrl? RawData.backgroundUrl : '';
            this.parent = RawData.parent;
            this.htmlRender();
            if (!this.canvas) {
                this.canvas = new fabric.Canvas(this.id + '-canvas', { selection: false, controlsAboveOverlay: false });
                fabric.Circle.prototype.originX = fabric.Circle.prototype.originY = 'center';
                fabric.Line.prototype.originX = fabric.Line.prototype.originY = 'center';
            }
            for (var i = 0; i < RawData.Shapes.length; i++) {
                var color = '#' + getRandomColor();
                var newShape = new Shape({
                    name: RawData.Shapes[i].name,
                    type: RawData.Shapes[i].type,
                    color: color,
                    canvas: this.canvas
                });
                for (var j = 0; j < RawData.Shapes[i].points.length; j++) {
                    var p = RawData.Shapes[i].points[j];
                    newShape.points.push(new Point({
                        name: p.name,
                        parentName: RawData.Shapes[i].name,
                        left: p.left,
                        top: p.top,
                        index: p.index,
                        fill: color,
                        stroke: color,
                        lockMovementX: (RawData.Shapes[i].type === "verticalLine" || RawData.Shapes[i].type === "line") ? false : true,
                        lockMovementY: (RawData.Shapes[i].type === "HorizontalLine" || RawData.Shapes[i].type === "line") ? false : true
                    }));
                }
                newShape.lbX = RawData.Shapes[i].lbX;
                newShape.lbY = RawData.Shapes[i].lbY;
                this.Shapes.push(newShape);
                newShape.Draw();
            }
        } else {
            this.htmlRender();
        }
        if (!this.canvas) {
            this.canvas = new fabric.Canvas(this.id + '-canvas', { selection: false, controlsAboveOverlay: false });
            fabric.Circle.prototype.originX = fabric.Circle.prototype.originY = 'center';
            fabric.Line.prototype.originX = fabric.Line.prototype.originY = 'center';
        }
        this.LoadBackground(this.backgroundUrl);
        this.initEvent();
        this.loadDataToTable();
        return vcanvas;
    };
    vcanvas.prototype.initEvent = function () {
        var c = this.canvas;
        var mother = this;
        $(window).load(function () {
            $('#' + mother.btnChangeBackgroundSaveId).click(function () {
                url = $('#' + mother.txtImgUrlId).val();
                if (url) {
                    $('#' + mother.bgModalId).modal('hide');
                    $('#' + mother.modalErrorId).text("");
                    mother.LoadBackground({ url: url });
                } else {
                    $('#' + mother.bgModalId).modal('show');
                    $('#' + mother.modalErrorId).text("");
                    $('#' + mother.modalErrorId).text("Image url cannot be empty. Please enter your image url!");
                }

            })
            $('#' + mother.btnAddRectId).click(function () {
                mother.Add({ type: "rect" });
            });

            $('#' + mother.btnAddVerticalLineId).click(function () {
                mother.Add({ type: "verticalLine" });
            });

            $('#' + mother.btnAddHorizontalLineId).click(function () {
                mother.Add({ type: "horizontalLine" });
            });

            $('#' + mother.btnDrawLineId).click(function () {
                mother.isDrawing = true;
            });
            $('#' + mother.btnExportId).click(function () {
                var js = mother.ToJson();
                console.log(js);
                $('#' + mother.txtDataId).val(js);
            });
            $('#' + mother.btnResetZoomId).click(function () {
                mother.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
                mother.canvas.renderAll();
            })
            $('#' + mother.btnZoomInId).click(function () {
                mother.canvas.setZoom(mother.canvas.getZoom() * 1.1);
            })
            $('#' + mother.btnZoomOutId).click(function () {
                mother.canvas.setZoom(mother.canvas.getZoom() / 1.1);
            })

        });
        $(c.wrapperEl).on('mousewheel', function (e) {
            var delta = e.originalEvent.wheelDelta / 500;
            var pointer = c.getPointer(e.e);
            var currentWidth = c.getWidth();
            var currentHeight = c.getHeight();
            if (delta > 0) {
                c.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), c.getZoom() * 1.1);
            }
            if (delta < 0) {
                c.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), c.getZoom() / 1.1);
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
        }
        $(window).resize(function () {
            if (c.width != $("#" + mother.id + '-wrapper').width()) {
                var scaleMultiplier = $("#" + mother.id + '-wrapper').width() / c.width;
                var objects = c.getObjects();

                c.setWidth(c.getWidth() * scaleMultiplier);
                c.setHeight(c.getHeight() * scaleMultiplier);
                c.renderAll();
                c.calcOffset();
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

                if ((o.e.type === 'touchmove') && (o.e.touches.length > 1)) { return; }
                if (mother.isDrawing) {
                    c.defaultCursor = "pointer";
                    mother.isMouseDown = true;
                    var pointer = c.getPointer(o.e);
                    var result = mother.randomName("line");

                    var A = new Point({ index: 0, name: "P-1", parentName: result.name, left: pointer.x, top: pointer.y, canvas: c });
                    var B = new Point({ index: 1, name: "P-2", parentName: result.name, left: pointer.x, top: pointer.y, canvas: c });
                    var line = new Shape({ name: result.name, index: result.index, type: "line", points: [A, B], canvas: c });
                    line.Draw();
                    mother.ActiveObject = line;
                } else if (mother.AddPointMode) {
                    var newPoint = new Point({ left: x0, top: y0 });
                    mother.ActiveObject.AddPoint(newPoint);
                } else {
                    var obj = o.target;
                    if (!obj || obj.get('type') === "image") {
                        mother.panning = true;
                        // canvas.defaultCursor = "all-scroll";
                        var allObject = c.getObjects();
                        for (var i = 0; i < allObject.length; i++) {
                            if (allObject[i].get('type') === "circle") {
                                allObject[i].set({ radius: 5 });
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
                    mother.ActiveObject.Draw();
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
                        obj.set({ hoverCursor: "default" });
                    }
                }
            },
            'mouse:out': function (e) {
                if (mother.tempPoint) {
                    c.remove(mother.tempPoint);
                    mother.tempPoint = null;
                    mother.LineHovered = null;
                }
            }
            ,
            'mouse:up': function (o) {
                if (mother.isDrawing) {
                    mother.ActiveObject.Remove();
                    mother.ActiveObject.Draw();
                    mother.Shapes.push(mother.ActiveObject);
                    mother.canvas.renderAll();
                }
                if (mother.ActiveObject) {
                    mother.ActiveObject.isMoving = false;
                }
                mother.loadDataToTable();
                mother.panning = false;
                mother.isDrawing = false;
                mother.isMouseDown = false;
            },
            'object:moving': function (e) {
                var p = e.target;
                var pointer = c.getPointer(e.e);
                var allObject = c.getObjects();
                if (p.name.split('-')[0] === "i") {
                    for (var i = 0; i < mother.Shapes.length; i++) {
                        if (p.parentName === mother.Shapes[i].name) {
                            mother.ActiveObject = mother.Shapes[i];
                            mother.Shapes[i].Move({ offsetX: e.e.movementX, offsetY: e.e.movementY });
                            break;
                        }
                    }
                }
                else {
                    for (var i = 0; i < mother.Shapes.length; i++) {
                        if (p.parentName === mother.Shapes[i].name) {
                            mother.Shapes[i].Move({ point: p });
                            break;
                        }
                    }
                }
                mother.canvas.renderAll();
            }
        });
    };
    vcanvas.prototype.htmlRender = function (Id) {
        var str = `<div class="modal fade" id="${this.bgModalId}" role="dialog">
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
                    <div class="col-sm-9 col-xs-12">
                        <div class="col-md-12 col-xs-12">
                            ${(!this.type || this.type == 'polygon' || this.type == "all") ? `<button  class="btn btn-sm btn-primary" id="${this.btnAddRectId}" ><i class="fa fa-plus"></i> Add Rect</button>` : ``}
                            ${(!this.type || this.type == 'line' || this.type == "all") ? `
                            <button class="btn btn-sm btn-success" id="${this.btnAddVerticalLineId}"><i class="fa fa-arrows-v"></i> Add vertical line</button>
                            <button class="btn btn-sm btn-success" id="${this.btnAddHorizontalLineId}"><i class="fa fa-arrows-h"></i> Add horizontal line</button>
                            <button class="btn btn-sm btn-danger" id="${this.btnDrawLineId}"><i class="fa fa-pencil"></i> Draw line</button>
                            `: ``}
                        </div>
                        <div class="col-md-12 col-xs-12">
                            <button class="btn btn-sm" id="${this.btnZoomInId}"><i class="fa fa-search-plus"></i> Zoom in</button>
                            <button class="btn btn-sm" id="${this.btnZoomOutId}"><i class="fa fa-search-minus"></i> Zoom out</button>
                            <button class="btn btn-sm btn-default" id="${this.btnResetZoomId}"><i class="fa fa-history"></i> Reset zoom</button>
                            <button class="btn btn-sm btn-default" id="${this.btnAddBackgroundId}" data-toggle="modal" data-target="#${this.bgModalId}"><i class="fa fa-file-image-o"></i> Change background</button>
                            <label class="${this.lblNoteId}" style="padding-left: 20px; color: red;" id="${this.lblNoteId}"></label>
                            <input type="text" name="${this.txtNameId}" id="txtName" hidden="true" width="10">
                            <input type="text" name="${this.txtDataId}" id="txtData" hidden="true" width="10">
                        </div>
                        <div class="col-xs-12 col-md-12">
                            <div id="${this.wrapperId}">
                                <canvas id="${this.canvasId}">
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-3 col-xs-12">
                        <div class="col-sm-12">
                        <button class="btn btn-sm btn-success" id="${this.btnExportId}"><i class="fa fa-cloud-download"></i> Export to JSON</button>
                        </div>
                        <div class="col-sm-12">
                            <div id="${this.tableWrapperId}" class="table-editable">
                            <table id="${this.tableId}" class="tblShape table table-hover table-sm text-center">
                                <thead>
                                    <tr>
                                        <th>#</th><th>Name</th><th>Type</th><th></th><th></th>
                                    </tr>
                                </thead><tbody></tbody></table>
                            </div>
                        </div>
                    </div>
                `;

        if ($(`#${this.parent}`).length) {
            $(`#${this.parent}`).append(str);
        }
    }
    vcanvas.prototype.loadDataToTable = function () {
        var mother = this;
        var context;
        parentElement = null;
        context = `${mother.Shapes.map(s =>
            `<tr>
                <td>
                    <i id="${mother.id + '-' + mother.tableId + '-' + s.name}" class="showDetail fa fa-plus" style="font-size:10pt"></i>
                </td>
                <td>
                    <input id="${mother.id + '-' + s.name + '-input-' + s.name}"  type="text" size="5" style="border:none" value="${s.name}" />
                </td>
                <td>
                    ${s.type}
                </td>
                <td style="width:50px">
                    ${(s.type == "rect") ? (s.AddPointMode ? `
                <label class="switch" data-toggle="tooltip" data-delay="0" data-placement="left" title="click on canvas where you want to add point!"><input id="${mother.id + '-' + s.name + '-switch-' + s.name}" type="checkbox" checked><span class="slider round"></span></label>` : `
                <label class="switch" data-toggle="tooltip" data-delay="0" data-placement="left" title="click on canvas where you want to add point!"><input id="${mother.id + '-' + s.name + '-switch-' + s.name}" type="checkbox" ><span class="slider round"></span></label>`) : ''}</td>
                <td>
                    <span id="${mother.id + '-' + s.name + '-spanRemoveShape-' + s.name}" class="table-remove fa fa-trash-o"></span>
                </td>
            </tr>
            <tr hidden="true">
                <td colspan="4">
                    <table style="background-color:#fff" class="tblShapeDetail table table-bordered">
                        <thead>
                            <tr><td><b>Point</b></td><td><b>X</b></td><td><b>Y</b></td><td></td></tr>
                        </thead>
                    <tbody>
                ${s.points.map(p =>
                `<tr id="${mother.id + '-' + s.name + '-tr-' + p.name}">
                    <td  hidden="true">${s.name}</td>
                    <td>${p.name}</td>
                    <td>${(mother.background.width) ? parseFloat((p.left / mother.background.width) * 100).toFixed(2) : parseFloat(p.left).toFixed(2)}</td>
                    <td>${(mother.background.height) ? parseFloat((p.top / mother.background.height) * 100).toFixed(2) : parseFloat(p.top).toFixed(2)}</td>
                    ${s.type == 'rect' ? `
                    <td><span id="${mother.id + '-' + s.name + '-spanRemovePoint-' + p.name}" class="point-remove fa fa-eraser"></span></td>` : ``}
                </tr>`
            ).join('')}</tbody></table></td></tr>
            `)}`;

        $('#' + this.tableId + ' tr').not(function () { return !!$(this).has('th').length; }).remove();
        $('#' + this.tableId + ' tr:last').after(context);
        mother.Shapes.forEach(function (s) {
            $('#' + mother.id + '-' + mother.tableId + '-' + s.name).click(function () { mother.ShowShapeDetail(s, mother.id + '-' + mother.tableId + '-' + s.name) });
            $('#' + mother.id + '-' + s.name + '-input-' + s.name).click(function () { mother.onInputClicked(s) });
            $('#' + mother.id + '-' + s.name + '-input-' + s.name).keypress(function () { return mother.ValidateKey() });
            $('#' + mother.id + '-' + s.name + '-input-' + s.name).change(function () { mother.textChange(mother.id + '-' + s.name + '-input-' + s.name) });
            $('#' + mother.id + '-' + s.name + '-switch-' + s.name).change(function () { mother.onChangeAddPoint(s, mother.id + '-' + s.name + '-switch-' + s.name) });
            $('#' + mother.id + '-' + s.name + '-spanRemoveShape-' + s.name).click(function () { mother.onRemoveShapeClicked(s) });
            s.points.forEach(function (p) {
                $('#' + mother.id + '-' + s.name + '-tr-' + p.name).click(function () { mother.onPointTrclicked(p) });
                $('#' + mother.id + '-' + s.name + '-spanRemovePoint-' + p.name).click(function () { mother.onPointRemoveClick(p) });
            });
        });
    };
    vcanvas.prototype.onPointTrclicked = function (obj) {
        var allObject = this.canvas.getObjects();
        for (var i = 0; i < allObject.length; i++) {
            if (allObject[i].get('type') === "circle") {
                allObject[i].set({ radius: 5 });
            }
        }
        var point = this.canvas.getItem(obj.name, obj.parentName);
        point.set({ radius: 15 });
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
            for (var i = 0; i < this.Shapes.length; i++) {
                if (this.Shapes[i].name === name) {
                    this.AddPointMode = true;
                    this.ActiveObject = this.Shapes[i];
                    this.Shapes[i].AddPointMode = true;
                } else {
                    this.Shapes[i].AddPointMode = false;
                }
            }
            this.loadDataToTable();
            $('#' + this.lblNoteId).text("Click on canvas where you want to add point!");
        } else {
            this.AddPointMode = false;
            $('#' + this.lblNoteId).text("");
            for (var i = 0; i < this.Shapes.length; i++) {
                if (this.Shapes[i].name === name) {
                    this.Shapes[i].AddPointMode = false;
                }
            }
        }
    }
    vcanvas.prototype.onRemoveShapeClicked = function (obj) {
        this.Remove(obj.name);
        this.loadDataToTable();
    }
    vcanvas.prototype.ShowShapeDetail = function (obj, id) {
        var name = obj.name;
        var element = document.getElementById(id);
        if (!this.prevSelected) {
            element.className = "hideDetail fa fa-minus";
            this.prevSelected = element;
            element.parentElement.parentElement.nextElementSibling.hidden = false;
        } else {
            var prevId = this.prevSelected.className.split(' ')[0];
            var currId = element.className.split(' ')[0];
            if (prevId === currId === "showDetail") {
                this.prevSelected.parentElement.parentElement.hidden = true;
                this.prevSelected.className = "showDetail fa fa-plus";

                element.className = "hideDetail fa fa-minus";
                this.prevSelected = element;
                element.parentElement.parentElement.nextElementSibling.hidden = false;
            } else if (prevId === currId === "hideDetail") {
                this.prevSelected.parentElement.parentElement.hidden = true;
                this.prevSelected.className = "showDetail fa fa-plus";

                element.className = "hideDetail fa fa-plus";
                this.prevSelected = null;
                element.parentElement.parentElement.nextElementSibling.hidden = true;
            }
            else if (prevId !== currId) {
                if (currId === "showDetail") {
                    element.className = "hideDetail fa fa-minus";
                    this.prevSelected = element;
                    element.parentElement.parentElement.nextElementSibling.hidden = false;
                } else {
                    element.className = "showDetail fa fa-plus";
                    this.prevSelected = null;
                    element.parentElement.parentElement.nextElementSibling.hidden = true;
                }
            } else {
                this.prevSelected = element;
                if (currId === "hideDetail") {
                    element.className = "showDetail fa fa-plus";
                    element.parentElement.parentElement.nextElementSibling.hidden = true;
                }
                else {
                    element.className = "hideDetail fa fa-minus";
                    element.parentElement.parentElement.nextElementSibling.hidden = false;
                }
            }
        }
    }
    vcanvas.prototype.onInputClicked = function (obj) {
        var name = obj.name;
        var points = [];
        var allObject = this.canvas.getObjects();
        for (var i = 0; i < allObject.length; i++) {
            if (allObject[i].get('type') === "circle") {
                allObject[i].set({ radius: 5 });
            }
        }
        for (var i = 0; i < this.Shapes.length; i++) {
            if (this.Shapes[i].name === name) {
                for (var j = 0; j < this.Shapes[i].points.length; j++) {
                    var p = this.canvas.getItem(this.Shapes[i].points[j].name, this.Shapes[i].name);
                    p && points.push(p);
                }
                break;
            }
        }
        if (points.length > 0) {
            for (var i = 0; i < points.length; i++) {
                points[i].set({ radius: 15 });
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
                    this.Remove(object);
                    this.Shapes.push(newShape);
                    element.defaultValue = newValue;
                }
            }
            else {
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
        var js = JSON.stringify(temp, this.replacer);
        return js;
    }
    vcanvas.prototype.RemoveProperties = function (obj) {
        replaceValues.push('background','ActiveObject','isDrawing','tempPoint','units','startX',
            'startY','LineHovered','prevSelected','js', 'url', 'panning', 'isMouseDown', 'AddPointMode',
            'isMoving', 'color','parentName', 'AddPointMode', 'lines', 'lbX', 'lbY', 'radius', 'fill', 'stroke', 'lockMovementX',
            'lockMovementY', 'canvas', 'x', 'y');
    }
    vcanvas.prototype.Add = function (params) {
        var properties = $.extend({
            name: null,
            type: null
        }, params);
        var name = properties.name;
        var type = properties.type;

        var result = this.randomName(type);
        var newShape = new Shape({ name: result.name, canvas: this.canvas });
        if (type === "rect") {
            newShape.Rect();
        } else if (type === "verticalLine") {
            newShape.VerticalLine();
        } else if (type === "horizontalLine") {
            newShape.HorizontalLine();
        }
        newShape.Draw();
        this.Shapes.push(newShape);
        this.loadDataToTable();
    };
    vcanvas.prototype.Get = function (object) {
        var shape;
        if (typeof object == 'string' || object instanceof String) {
            this.Shapes.forEach(function (s) {
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
        this.Shapes.forEach(function (o) {
            index++;
            if (o.type.slice(-4).toUpperCase() == type.slice(-4).toUpperCase())
                lstName.push(o.name);
        });

        while (isExsit) {
            if (type === 'line' || type === 'verticalLine' || type === 'horizontalLine')
                name = "Line-" + i;
            else
                name = "Rect-" + i;
            if (lstName.indexOf(name) == -1) {
                isExsit = false;
            } else {
                ++i;
            }
        }
        return { name: name, index: index };
    };
    vcanvas.prototype.getItem = function (name, parentName) {
        var object = null, objects = this.canvas.getObjects();
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
            }
            else {
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
            url: this.backgroundUrl
        }, params);
        var bgr = new Background();
        var c = this.canvas;
        this.backgroundUrl = properties.url;
        bgr.url = this.backgroundUrl;
        var bgImg = this.getItem('background', null);
        this.canvas.remove(bgImg);
        fabric.Image.fromURL(this.backgroundUrl, function (img) {
            img.selectable = false;
            img.set({ name: 'background', left: 0, top: 0 });
            bgr.height = img.height;
            bgr.width = img.width;
            c.add(img);
            c.sendToBack(img);
            c.setZoom(0.7);
            c.renderAll();
        });
        this.background = bgr;
    };
    vcanvas.prototype.Remove = function (object) {
        if (typeof object == 'string' || object instanceof String) {
            var o = this.Get(object);
            o.Remove();
            this.Shapes.splice(this.Shapes.indexOf(o), 1);
        } else {
            o.Remove();
            this.Shapes.splice(this.Shapes.indexOf(object), 1);
        }
        this.loadDataToTable();
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
            canvas: null

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
    }
    Point.prototype.Draw = function (c) {
        var p = new fabric.Circle({
            left: this.left,
            top: this.top,
            fill: this.fill,
            radius: 5,
            strokeWidth: 1,
            stroke: "black",
            name: this.name,
            parentName: this.parentName,
            hoverCursor: "pointer"
        });
        this.canvas = c;
        if (this.lockMovementX)
            p.set({ lockMovementX: true });
        if (this.lockMovementY)
            p.set({ lockMovementY: true });
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
            type: "rect",
            points: [],
            color: '#' + getRandomColor(),
            isMoving: false,
            lbX: 0,
            lbY: 0,
            AddPointMode: false,
            canvas: null
        }, params);
        this.name = properties.name;
        this.type = properties.type;
        this.points = properties.points;
        this.color = properties.color;
        this.isMoving = properties.isMoving;
        this.canvas = properties.canvas;
    };
    Shape.prototype.DrawLabel = function () {
        if (!this.lbX && !this.lbY) {
            for (var i = 0; i < this.points.length; i++) {
                if (this.points[i].name == "P-1") {
                    this.lbX = this.points[i].left + 5;
                    this.lbY = this.points[i].top - 30;
                    break;
                }
            }
        }
        var label = new fabric.Text(this.name, {
            name: "lb-" + this.name, parentName: this.name, left: this.lbX, top: this.lbY,
            fontSize: 20, fontFamily: "calibri", fill: this.color, hasRotatingPoint: false,
            centerTransform: true, selectable: true
        });
        label.hasControls = label.hasBorders = false;
        this.canvas.add(label);
    };
    Shape.prototype.Rect = function () {
        this.type = 'rect';
        var p1 = new Point({ index: 0, name: "P-1", parentName: this.name, left: 175, top: 175, fill: this.color, stroke: this.color, canvas: this.canvas });
        var p2 = new Point({ index: 1, name: "P-2", parentName: this.name, left: 350, top: 175, fill: this.color, stroke: this.color, canvas: this.canvas });
        var p3 = new Point({ index: 2, name: "P-3", parentName: this.name, left: 350, top: 300, fill: this.color, stroke: this.color, canvas: this.canvas });
        var p4 = new Point({ index: 3, name: "P-4", parentName: this.name, left: 175, top: 300, fill: this.color, stroke: this.color, canvas: this.canvas });
        this.points = [p1, p2, p3, p4];
    }
    Shape.prototype.VerticalLine = function () {
        this.type = 'line',
            this.points = [
                new Point({ index: 0, name: "P-1", parentName: this.name, left: 175, top: 175, fill: this.color, stroke: this.color, lockMovementX: true, canvas: this.canvas }),
                new Point({ index: 1, name: "P-2", parentName: this.name, left: 175, top: 500, fill: this.color, stroke: this.color, lockMovementX: true, canvas: this.canvas })
            ];
    }
    Shape.prototype.HorizontalLine = function () {
        this.type = 'line';
        this.points = [
            new Point({ index: 0, name: "P-1", parentName: this.name, left: 175, top: 175, fill: this.color, stroke: this.color, lockMovementY: true, canvas: this.canvas }),
            new Point({ index: 1, name: "P-2", parentName: this.name, left: 500, top: 175, fill: this.color, stroke: this.color, lockMovementY: true, canvas: this.canvas })
        ];
    }
    Shape.prototype.Draw = function () {
        var dlines = {};
        if (this.type == "line" || this.type == "verticalLine" || this.type == "horizontalLine") {
            var line = new fabric.Line([this.points[0].left, this.points[0].top, this.points[1].left, this.points[1].top], {
                name: this.name,
                parentName: this.name,
                strokeWidth: 2,
                fill: this.color,
                stroke: this.color,
                originX: 'center',
                originY: 'center',
                selectable: false
            });
            this.lines = [line.name];
            dlines[line.name] = line;
            this.canvas.add(line);
        }
        else {
            this.x = (this.points[0].left + this.points[2].left) / 2;
            this.y = (this.points[0].top + this.points[2].top) / 2;
            for (var i = 0; i < this.points.length; i++) {
                var line;
                if (i !== (this.points.length - 1)) {
                    line = new fabric.Line([this.points[i].left, this.points[i].top, this.points[i + 1].left, this.points[i + 1].top],
                        { name: "line" + i, parentName: this.name, fill: this.color, strokeWidth: 2, stroke: this.color, selectable: false, hasControls: false, hasBorders: false, hasRotatingPoint: false, hoverCursor: this.hoverCursor });
                } else {
                    line = new fabric.Line([this.points[i].left, this.points[i].top, this.points[0].left, this.points[0].top],
                        { name: "line" + i, parentName: this.name, fill: this.color, strokeWidth: 2, stroke: this.color, selectable: false, hasControls: false, hasBorders: false, hasRotatingPoint: false, hoverCursor: this.hoverCursor });
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
        this.FillInside();
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].hoverCursor = this.hoverCursor;
            this.points[i].fill = this.color;
            this.points[i].Draw(this.canvas);
        }
        this.DrawLabel();
    };
    Shape.prototype.Move = function (params) {
        var properties = $.extend({
            //these are the defaults
            offsetX: 0,
            offsetY: 0,
            point: null
        }, params);
        var offsetX = properties.offsetX;
        var offsetY = properties.offsetY;
        var point = properties.point;
        this.Remove();
        if (point) {
            for (var i = 0; i < this.points.length; i++) {
                if (point.name === this.points[i].name) {
                    this.points[i].left = point.left;
                    this.points[i].top = point.top;
                    break;
                }
            }
            this.lbX = this.points[0].left + 5;
            this.lbY = this.points[0].top - 30;
        } else {
            this.GetNewCoodr(offsetX, offsetY);
        }
        this.Draw();
    }
    Shape.prototype.FillInside = function () {
        var pathDirection = 'M';
        this.points.forEach(function (p) {
            pathDirection += ' ' + p.left + ' ' + p.top + ' L';
        });
        pathDirection += ' z';
        var path = new fabric.Path(pathDirection);
        path.set({ name: 'i-' + this.name, parentName: this.name, opacity: 0.005, hasControls: false, hasBorders: false, hasRotatingPoint: false });
        if (this.type === 'rect') {
            path.set({ perPixelTargetFind: true });
        }
        // if (this.type === "line" || this.type === "verticalLine" || this.type === "horizontalLine"){
        //     path.set({strokeWidth: 5});    

        // }
        this.canvas.add(path);
    };
    Shape.prototype.Rename = function (newName) {
        var oldName = this.name;
        this.name = newName;
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
        this.Draw();
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
        this.Draw();
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
        this.Draw();
    }
    Shape.prototype.Convex = function () {//Kiem tra da giac loi
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
    Shape.prototype.Inside = function (p) {//kiem tra 1 diem co nam trong da giac
        var totalAngle = 0;
        var p1 = this.points[0];
        var i1, i2;
        var type = "convex";

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
    Shape.prototype.Centroid = function () {//tinh toa do trong tam
        var nPts = this.points.length;
        var x = 0; var y = 0;
        var f;
        var j = nPts - 1;
        var p1; var p2;

        for (var i = 0; i < nPts; j = i++) {
            p1 = this.points[i]; p2 = this.points[j];
            f = p1.left * p2.top - p2.left * p1.top;
            x += (p1.left + p2.left) * f;
            y += (p1.top + p2.top) * f;
        }
        f = this.Area() * 6;
        return new Point("G", this.name, x / f, y / f, 5, this.color, 1, this.color, "", "", false, false, -2);
    };
    Shape.prototype.Area = function () {//tinh dien tich
        var area = 0;
        var nPts = this.points.length;
        var j = nPts - 1;
        var p1; var p2;
        for (var i = 0; i < nPts; j = i++) {
            p1 = this.points[i];
            p2 = this.points[j];
            area += p1.left * p2.top;
            area -= p1.top * p2.left;
        }
        area /= 2;

        return area;
    };
    Shape.prototype.CCW = function (p1, p2, p3) {//kiem tra doan thang p2p3 sang trai hay phai so vs doan p1p2 ; -1 sang trai, 1 sang phai, 0 thang hang
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
    Shape.prototype.Intersect = function (p1l1, p2l2, p1l2, p2l2) {//Check 2 duong thang cat nhau
        var a1, b1, c1, a2, b2, c2, t1, t2;
        var f1 = this.Extract(p1l1, p2l2);
        var f2 = this.Extract(p2l1, p2l2);
        a1 = f1.a; b1 = f1.b; c1 = f1.c;
        a2 = f2.a; b2 = f2.b; c2 = f2.c;
        t1 = (p1l1.left * a2 + p1l1.top * b2 + c2) * (p1l1.left * a2 + p2l1.top * b2 + c2);
        t2 = (p1l1.left * a1 + p1l1.top * b1 + c1) * (p2l1.left * a1 + p2l1.top * b1 + c1);
        return (t1 < Number.EPSILON && t2 < Number.EPSILON) ? true : false;
    };
    Shape.prototype.Extract = function (p1, p2) {//xay dung phuong trinh duong thang ax+by+c=0, tra ve a,b,c
        var a = p1.top - p2.top;
        var b = p1.left - p2.left;
        var c = -(a * p1.left + b * p1.top);
        return {
            a: a, b: b, c: c
        };
    };
    Shape.prototype.GetNewCoodr = function (a, b) {//tinh lai toa do khi di chuyen
        for (var i = 0; i < this.points.length; ++i) {
            this.points[i].left += a;
            this.points[i].top += b;
        }
        this.lbX += a;
        this.lbY += b;
    };
    return Shape;
}());
vcanvas.prototype.getItem = function (name, parentName) {
    var object = null, objects = this.canvas.getObjects();
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
        }
        else {
            if (objects[i].name && objects[i].name === name) {
                object = objects[i];
                break;
            }
        }
    }
    return (name) ? object : os;
};
var getRandomInt = function (start, end) { return Math.floor(Math.random() * end) + start; }
var getRandomColor = function () { return (pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2)); }
var pad = function (str, length) {
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}
var getRandomNum = function (min, max) { return Math.random() * (max - min) + min; }
fabric.Canvas.prototype.getItem = function (name, parentName) {
    var object = null, objects = this.getObjects();
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
        }
        else {
            if (objects[i].name && objects[i].name === name) {
                object = objects[i];
                break;
            }
        }
    }
    return (name) ? object : os;
};