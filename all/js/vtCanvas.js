var canvas;
var vcanvas = /** @class */ (function () {
    function vcanvas(params) {
        var properties = $.extend({
            //these are the defaults
            parent: null,
            tableParent: null,
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
        }, params);
        this.parent = properties.parent;
        this.tableParent = properties.tableParent;
        this.backgroundUrl = properties.backgroundUrl;
        this.Shapes = properties.Shapes;
        this.units = properties.units;
        this.startX = properties.startX;
        this.startY = properties.startY;
        this.tempPoint = properties.tempPoint;
        this.LineHovered = properties.LineHovered;
        this.ActiveObject = properties.ActiveObject;
        this.prevSelected = properties.prevSelected;
    }
    vcanvas.prototype.init = function(params){
        var properties = $.extend({
            js: null
        },params);
        var json = properties.js;

        var element = $("#canvas").length;
        if(!element){
            $("#" + this.parent).append('<canvas id="canvas"></canvas>');    
        }

        if (!this.canvas){
            this.canvas  = new fabric.Canvas('canvas', {selection: false,controlsAboveOverlay:false});

            fabric.Circle.prototype.originX = fabric.Circle.prototype.originY = 'center';
            fabric.Line.prototype.originX = fabric.Line.prototype.originY = 'center';
        }
        if(json){
            this.Shapes = [];
            var RawData = JSON.parse(json);
            this.backgroundUrl = RawData.background.url;
            this.parent = RawData.parent;
            this.tableParent = RawData.tableParent;
            var element = $("#"+this.parent).length;
            if(!element){
                $("#" + this.parent).append('<canvas id="canvas"></canvas>');    
            }
            
            if (!this.canvas){
                this.canvas  = new fabric.Canvas('canvas', {selection: false,controlsAboveOverlay:false});

                fabric.Circle.prototype.originX = fabric.Circle.prototype.originY = 'center';
                fabric.Line.prototype.originX = fabric.Line.prototype.originY = 'center';
            }
            for (var i = 0; i < RawData.Shapes.length; i++) {
                var newShape = new Shape({
                    name: RawData.Shapes[i].name,
                    type: RawData.Shapes[i].type,
                    color: RawData.Shapes[i].color,
                    canvas:this.canvas
                });
                RawData.Shapes[i].points.forEach(function(p){
                    newShape.points.push(new Point({
                        name: p.name, 
                        parent: p.parent, 
                        left: p.left, 
                        top: p.top, 
                        radius: p.radius, 
                        fill: p.fill, 
                        strokeWidth:p.strokeWidth, 
                        stroke: p.stroke, 
                        lockMovementX: p.lockMovementX, 
                        lockMovementY: p.lockMovementY, 
                        index: p.index
                    }));
                });
                newShape.lbX = RawData.Shapes[i].lbX;
                newShape.lbY = RawData.Shapes[i].lbY;
                this.Shapes.push(newShape);
                newShape.Draw();
            }
        }
        this.LoadBackground(this.backgroundUrl);
        this.initEvent();
        this.initTable();
        this.loadDataToTable();
        return vcanvas;
    };
    vcanvas.prototype.initEvent = function(){
        var c = this.canvas;
        var mother = this;
        $(c.wrapperEl).on('mousewheel', function (e) {
            var delta = e.originalEvent.wheelDelta / 500;
            var pointer = c.getPointer(e.e);
            var currentWidth = c.getWidth();
            var currentHeight = c.getHeight();
            if (delta > 0 ) {
                c.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), c.getZoom() * 1.1);
            }
            if (delta < 0 ){
                c.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), c.getZoom() / 1.1);
            }
            return false;
        });
        if (c.width != $("#" + mother.parent).width()) {
            var scaleMultiplier = $("#" + mother.parent).width() / c.width;
            var objects = c.getObjects();

            c.setWidth(c.getWidth() * scaleMultiplier);
            c.setHeight(c.getHeight() * scaleMultiplier);
            c.renderAll();
            c.calcOffset();
        }
        $(window).resize(function (){
            if (c.width != $("#" + mother.parent).width()) {
                var scaleMultiplier = $("#" + mother.parent).width() / c.width;
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
                if (o.e.type == "touchstart"){
                    startX = o.e.touches[0].pageX;
                    startY = o.e.touches[0].pageY;  
                }

                if((o.e.type === 'touchmove') && (o.e.touches.length > 1)) { return; }
                if (mother.isDrawing) {
                    c.defaultCursor = "pointer";
                    mother.isMouseDown = true;
                    var pointer = c.getPointer(o.e);
                    var result = mother.randomName("line");

                    var A = new Point({index: 0, name:"P-1", parent:result.name, left:pointer.x, top:pointer.y, canvas:c});
                    var B = new Point({index: 1, name:"P-2", parent:result.name, left:pointer.x, top:pointer.y, canvas:c});
                    var line = new Shape({name:result.name, index: result.index, type:"line", points:[A, B], canvas:c});
                    line.Draw();
                    mother.ActiveObject = line;
                } else if (mother.AddPointMode){
                    var newPoint = new Point({left:x0, top:y0});
                    mother.ActiveObject.AddPoint(newPoint);
                }else {
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
                    if (mother.ActiveObject.points[i].name === "P-2"){
                        mother.ActiveObject.points[i].left = pointer.x;
                        mother.ActiveObject.points[i].top = pointer.y;
                    }
                }
                mother.ActiveObject.Draw();
                //line.set({ x2: pointer.x, y2: pointer.y });
                c.renderAll();
            }
            if (mother.panning && o && o.e) {
                if (o.e.type !== "touchmove"){
                    var delta = new fabric.Point(o.e.movementX, o.e.movementY);
                    c.relativePan(delta);
                }else{
                    var delta = new fabric.Point((o.e.touches[0].pageX - startX)/10, (o.e.touches[0].pageY - startY)/10);
                    c.relativePan(delta);
                }
            }
        },
        'mouse:over': function (e) {
            var obj = e.target;
            if (obj){
                if ( obj.get('type') == "image") {
                    obj.set({ hoverCursor: "default" });
                }
            }
        },
        'mouse:out': function(e){
            if(mother.tempPoint)
            {
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
            if(mother.ActiveObject){
                mother.ActiveObject.isMoving = false;
            }
            mother.loadDataToTable();
            mother.panning = false;
            mother.isDrawing = false;
            mother.isMouseDown = false;
        },
        'object:moving': function(e) {
            var p = e.target;
            var pointer = c.getPointer(e.e);
            var allObject = c.getObjects();
            if (p.name.split('-')[0] === "i") {
                for (var i = 0; i < mother.Shapes.length; i++) {
                    if (p.parent === mother.Shapes[i].name) {
                        mother.ActiveObject = mother.Shapes[i];
                        mother.Shapes[i].Move({offsetX:e.e.movementX, offsetY: e.e.movementY});
                        break;
                    }
                }
            } 
            else {
                for (var i = 0; i < mother.Shapes.length; i++) {
                    if (p.parent === mother.Shapes[i].name) {
                        mother.Shapes[i].Move({point: p});
                        break;
                    }
                }
            }
            mother.canvas.renderAll();
        }});
};
vcanvas.prototype.initTable = function(){
    var eTable = $('#tblShape').length;
    if(!eTable){
        $("#" + this.tableParent).append('<table class="tblShape table table-hover table-sm text-center"><thead><tr><th>#</th><th>Name</th><th>Type</th><th></th><th></th></tr></thead><tbody></tbody></table>');    
    }
}
vcanvas.prototype.loadDataToTable = function() {
    var mother = this;
    var context = "";
    parentElement = null;
    for (var i = 0; i < mother.Shapes.length; i++) {
        if (mother.Shapes[i].type == "line")
        {
            context += '<tr><td><i class="showDetail fa fa-plus" style="font-size:10pt" onclick="ShowShapeDetail(this,event);"></i></td><td class="name"><input id="name" onclick="onInputClicked(this);" type="text" size="5" style="border:none" onchange="textChange(this,this.value);" onkeypress="return ValidateKey();" value="' + mother.Shapes[i].name
            +'" /></td><td>'+mother.Shapes[i].type+'</td><td></td><td><span class="table-remove fa fa-trash-o"></span></td></tr>' +
            '<tr hidden="true" ><td colspan="4"><table style="background-color:#fff" class="tblShapeDetail table table-bordered"><thead><tr><td><b>Point</b></td><td><b>X</b></td><td><b>Y</b></td></tr></thead><tbody>';
            mother.Shapes[i].points.forEach(function(p){
                var x = (mother.background.width)? parseFloat((p.left /mother.background.width)* 100).toFixed(2):parseFloat(p.left).toFixed(2);
                var y = (mother.background.height)? parseFloat((p.top / mother.background.height)* 100).toFixed(2):parseFloat(p.top).toFixed(2);
                context += '<tr onclick="showPointDetail(this);"><td hidden="true">'+mother.Shapes[i].name+'</td><td>'+p.name+'</td><td>'+ x +'</td><td>'+ y +'</td></tr>';
            });
            context += '</tbody></table></td></tr>';
        }else{
            context += '<tr><td><i class="showDetail fa fa-plus" style="font-size:10pt" onclick="ShowShapeDetail(this,event);"></i></td><td><input id="name" size="5" type="text" style="border:none" onclick="onInputClicked(this);" onchange="textChange(this,this.value);" onkeypress="return ValidateKey();" value="' + mother.Shapes[i].name
            +'" /></td><td>'+mother.Shapes[i].type+'</td><td style="width:50px">';
            if (mother.Shapes[i].AddPointMode){
                context +='<label class="switch" data-toggle="tooltip" data-delay="0" data-placement="left" title="click on canvas where you want to add point!"><input id="switchAddPoint" onchange="onChangeAddPoint(this);" type="checkbox" checked><span class="slider round"></span></label>';
            }else{
                context +='<label class="switch" data-toggle="tooltip" data-delay="0" data-placement="left" title="click on canvas where you want to add point!"><input id="switchAddPoint" onchange="onChangeAddPoint(this);" type="checkbox" ><span class="slider round"></span></label>';
            }
            context += '</td><td><span class="table-remove fa fa-trash-o" onclick="onRemoveShapeClicked(this);"></span></td></tr>' +
            '<tr hidden="true" ><td colspan="4"><table style="background-color:#fff" class="tblShapeDetail table table-bordered"><thead><tr><td><b>Point</b></td><td><b>X</b></td><td><b>Y</b></td><td>#</td></tr></thead><tbody>';
            mother.Shapes[i].points.forEach(function(p){
                var x = (mother.background.width)? parseFloat((p.left /mother.background.width)* 100).toFixed(2):parseFloat(p.left).toFixed(2);
                var y = (mother.background.height)? parseFloat((p.top / mother.background.height)* 100).toFixed(2):parseFloat(p.top).toFixed(2);
                context += '<tr onclick="showPointDetail(this);"><td hidden="true">'+mother.Shapes[i].name+'</td><td>'+p.name+'</td><td>'+ x +'</td><td>'+ y +'</td><td><span class="point-remove fa fa-eraser" onclick="onPointRemoveClick(this);"></span></td></tr>';
            });
            context += '</tbody></table></td></tr>';
        }
    }
    var test = $('#'+this.tableParent+' tr');
    var test2 = $('#'+this.tableParent+' tr:last');
    $('#'+this.tableParent+' tr').not(function(){ return !!$(this).has('th').length; }).remove();
    $('#'+this.tableParent+' tr:last').after(context);

};
vcanvas.prototype.initTableEvent = function(){
    var mother = this;
    $('.tblShape').on("blur","tr",function(e){
        var allObject = mother.canvas.getObjects();
        for (var i = 0; i < allObject.length; i++) {
            if (allObject[i].get('type') === "circle") {
                allObject[i].set({ strokeWidth: 1 });
            }
        }
    });

    $('.tblShape').on('click', 'span', function (e) {
        var name = this.parentElement.parentElement.cells[1].firstChild.value;
        mother.Remove(name);
    });
}
vcanvas.prototype.ValidateKey = function(){
    var key=window.event.keyCode;
    var allowed='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-.0123456789';
    return allowed.indexOf(String.fromCharCode(key)) !=-1 ;
}
vcanvas.prototype.ShowShapeDetail = function(element, event){
    if (!this.prevSelected){
        element.className = "hideDetail fa fa-minus";   
        this.prevSelected = element;
        element.parentElement.parentElement.nextElementSibling.hidden=false;
    }else{
        var prevId = this.prevSelected.className.split(' ')[0];
        var currId = element.className.split(' ')[0];
        if (prevId === currId === "showDetail"){
            this.prevSelected.parentElement.parentElement.hidden=true;
            this.prevSelected.className = "showDetail fa fa-plus";

            element.className = "hideDetail fa fa-minus";   
            this.prevSelected = element;
            element.parentElement.parentElement.nextElementSibling.hidden=false;    
        }else if(prevId === currId === "hideDetail"){
            this.prevSelected.parentElement.parentElement.hidden=true;
            this.prevSelected.className = "showDetail fa fa-plus";

            element.className = "hideDetail fa fa-plus";    
            this.prevSelected = null;
            element.parentElement.parentElement.nextElementSibling.hidden=true; 
        }
        else if (prevId !== currId){
            if(currId === "showDetail"){
                element.className = "hideDetail fa fa-minus";   
                this.prevSelected = element;
                element.parentElement.parentElement.nextElementSibling.hidden=false;    
            }else{
                element.className = "showDetail fa fa-plus";    
                this.prevSelected = null;
                element.parentElement.parentElement.nextElementSibling.hidden=true; 
            }
        }else{
            this.prevSelected = element;
            if (currId === "hideDetail"){
                element.className = "showDetail fa fa-plus";    
                element.parentElement.parentElement.nextElementSibling.hidden=true; 
            }
            else{
                element.className = "hideDetail fa fa-minus";   
                element.parentElement.parentElement.nextElementSibling.hidden=false;    
            }
        }
    }
};
vcanvas.prototype.showPointDetail = function(e){
        // console.log('td clicked');
        var name = e.cells[0].innerText;
        var pname = e.cells[1].innerText;
        var allObject = vCanvas.canvas.getObjects();
        for (var i = 0; i < allObject.length; i++) {
            if (allObject[i].get('type') === "circle") {
                allObject[i].set({ radius: 5 });
            }
        }
        var point = vCanvas.canvas.getItem(pname, name);
        point.set({radius: 15});
        vCanvas.canvas.renderAll();
    };
    vcanvas.prototype.onInputClicked = function(e){
        var name = e.value;
        var points = [];
        var allObject = vCanvas.canvas.getObjects();
        for (var i = 0; i < allObject.length; i++) {
            if (allObject[i].get('type') === "circle") {
                allObject[i].set({ radius: 5 });
            }
        }
        for (var i = 0; i < vCanvas.Shapes.length; i++) {
            if (vCanvas.Shapes[i].name === name) {
                for (var j = 0; j < vCanvas.Shapes[i].points.length; j++) {
                    var p = vCanvas.canvas.getItem(vCanvas.Shapes[i].points[j].name, vCanvas.Shapes[i].name);
                    p && points.push(p);
                }
                break;
            }
        }
        if (points.length > 0) {
            for (var i = 0; i < points.length; i++) {
                points[i].set({radius: 15});
            }
            vCanvas.canvas.renderAll();
        }
    };
    vcanvas.prototype.onChangeAddPoint = function(e) {
        var name = e.parentElement.parentElement.parentElement.cells[1].firstChild.value;
        if(e.checked)
        {
            for(var i=0; i < vCanvas.Shapes.length; i++){
                if(vCanvas.Shapes[i].name === name){
                    vCanvas.AddPointMode = true;
                    vCanvas.ActiveObject = vCanvas.Shapes[i];
                    vCanvas.Shapes[i].AddPointMode = true;
                }else{
                    vCanvas.Shapes[i].AddPointMode = false;
                }
            }
            this.loadDataToTable();
            $('.lblNote').text("Click on canvas where you want to add point!");
        }else{
            vCanvas.AddPointMode =false;
            $('.lblNote').text("");
            for(var i=0; i < vCanvas.Shapes.length; i++){
                if (vCanvas.Shapes[i].name === name){
                    vCanvas.Shapes[i].AddPointMode = false;
                }
            }
        }
    };
    vcanvas.prototype.onPointRemoveClick = function(e){
        var parent = e.parentElement.parentElement.cells[0].innerText;
        var name = e.parentElement.parentElement.cells[1].innerText;
        var obj = vCanvas.Get(parent);
        obj.RemovePoint(name);
        this.loadDataToTable();
    };
    vcanvas.prototype.onRemoveShapeClicked = function(e){
        var name = e.parentElement.parentElement.cells[1].firstChild.value;
        vCanvas.Remove(name);
        this.loadDataToTable();
    };
    vcanvas.prototype.textChange = function(element, newValue) {
        var oldvalue = element.defaultValue;
        var isExsit = false;
        if (newValue !== oldvalue) {
            var obj = vCanvas.Get(newValue);
            if (obj){
                isExsit = true;
            }
            if(!isExsit){
                var object = vCanvas.Get(oldvalue);
                if (object) {
                    var newShape = object.Rename(newValue);
                    vCanvas.Remove(object);
                    vCanvas.Shapes.push(newShape);
                    element.defaultValue = newValue;
                }
            }
            else{
                alert("Name already exsit !");
                element.value = oldvalue;
            }
        }
        console.log(newValue);
    };
    vcanvas.prototype.ToJson = function () {
        var temp = Object.assign({},this);
        temp.Shapes.forEach(function(s) {
            s.canvas = undefined;
            s.points.forEach(function(p) {
                p.canvas = undefined;
            })
        });
        temp.canvas = undefined;

        var js = JSON.stringify(temp, this.replacer);
        return js;
    };
    vcanvas.prototype.replacer = function(key,value){
        if (key=="canvas")
            return undefined;
        else 
            return value;
    };
    vcanvas.prototype.Add = function(params){
        var properties = $.extend({
            name: null,
            type: null
        },params);
        var name = properties.name;
        var type = properties.type;

        var result = this.randomName(type);
        var newShape = new Shape({name:result.name,index:result.index, canvas: this.canvas});
        if(type === "rect"){
            newShape.Rect();    
        }else if(type === "verticalLine"){
            newShape.VerticalLine();
        }else if(type === "horizontalLine"){
            newShape.HorizontalLine();
        }
        newShape.Draw();
        this.Shapes.push(newShape);
        this.loadDataToTable();
    };
    vcanvas.prototype.Get = function(object){
        var shape;
        if(typeof object == 'string' || object instanceof String){
            this.Shapes.forEach(function(s){
                if(s.name === object){
                    shape = s;
                }
            });
        }else if(isNaN(object)){
            this.Shapes.forEach(function(s){
                if(s.index === object.index){
                    shape = s;
                }
            });
        }
        return shape;
    };
    vcanvas.prototype.randomName = function(type) {
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
                name = "Line-"+i;
            else
                name = "Rect-" + i;
            if (lstName.indexOf(name) == -1) {
                isExsit = false;
            }else{
                ++i;
            }
        }
        return {name:name, index:index};
    };
    vcanvas.prototype.getItem = function (name, parent) {
        var object = null, objects = this.canvas.getObjects();
        var os = [];
        for (var i = 0, len = this.canvas.size(); i < len; i++) {
            if (parent) {
                if(name){
                    if (objects[i].name && objects[i].name === name && objects[i].parent === parent) {
                        object = objects[i];
                        break;
                    }
                }else{
                    if (objects[i].parent === parent) {
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
        return (name)?object:os;
    };
    vcanvas.prototype.LoadBackground = function(params){
        var properties = $.extend({
            url: this.backgroundUrl
        }, params);
        var bgr = new Background();
        var c = this.canvas;
        this.url = properties.url;
        bgr.url = this.url;
        var bgImg = this.getItem('background', null);
        this.canvas.remove(bgImg);
        fabric.Image.fromURL(this.url, function (img) {
            img.selectable = false;
            img.set({name: 'background', left: 0, top: 0});
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
        if(typeof object == 'string' || object instanceof String){
            var o = this.Get(object);
            o.Remove();
            this.Shapes.splice(this.Shapes.indexOf(o), 1);
        }else{
            o.Remove();
            this.Shapes.splice(this.Shapes.indexOf(object), 1);
        }
        this.loadDataToTable();
    };
    return vcanvas;
}());
var Background = (function(){
    function Background(params){
        var properties = $.extend({ 
            url:null,
            width: 0,
            height: 0,
        },params);
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
            parent: null,
            left: 0,
            top: 0,
            radius: 5,
            fill: null,
            stroke: null,
            strokeWidth: 1,
            hoverCursor: 'pointer',
            lockMovementX: false,
            lockMovementY:false,
            lbX: 0,
            lbY: 0,
            canvas: null

        }, params);
        this.index = properties.index;
        this.name = properties.name;
        this.parent = properties.parent;
        this.left = properties.left;
        this.top = properties.top;
        this.radius = properties.radius;
        this.fill = properties.fill;
        this.strokeWidth = properties.strokeWidth;
        this.stroke = properties.stroke;
        this.hoverCursor = properties.hoverCursor;
        this.lockMovementX = properties.lockMovementX;
        this.lockMovementY = properties.lockMovementY;
        this.lbX = properties.lbX;
        this.lbY = properties.lbY;
        this.canvas = properties.canvas;
    }
    Point.prototype.Draw = function (c) {
        var p = new fabric.Circle({
            left: this.left,
            top: this.top,
            fill: this.fill,
            radius: this.radius,
            strokeWidth: this.strokeWidth,
            stroke: "black",
            name: this.name,
            parent: this.parent,
            hoverCursor: this.hoverCursor
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
            index: null,
            name: null,
            type: "rect",
            points: [],
            color: '#' + getRandomColor(),
            hoverCursor: 'pointer',
            isMoving: false,
            lbX: 0,
            lbY: 0,
            AddPointMode: false,
            canvas: null
        }, params);
        this.index = properties.index;
        this.name = properties.name;
        this.type = properties.type;
        this.points = properties.points;
        this.color = properties.color;
        this.isMoving = properties.isMoving;
        this.hoverCursor = properties.hoverCursor;
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
            name: "lb-" + this.name, parent: this.name, left: this.lbX, top: this.lbY,
            fontSize: 20, fontFamily: "calibri", fill: this.color, hasRotatingPoint: false, 
            centerTransform: true, selectable:true, hoverCursor: this.hoverCursor });
        label.hasControls = label.hasBorders = false;
        this.canvas.add(label);
    };
    Shape.prototype.Rect = function (){
        this.type = 'rect';
        this.points = [
        new Point({index:0, name:"P-1", parent:this.name, left:175, top:175, fill:this.color, stroke:this.color, canvas:this.canvas}),
        new Point({index:1, name:"P-2", parent:this.name, left:350, top:175, fill:this.color, stroke:this.color, canvas:this.canvas}),
        new Point({index:2, name:"P-3", parent:this.name, left:350, top:300, fill:this.color, stroke:this.color, canvas:this.canvas}),
        new Point({index:3, name:"P-4", parent:this.name, left:175, top:300, fill:this.color, stroke:this.color, canvas:this.canvas})
        ];
    }
    Shape.prototype.VerticalLine = function(){
        this.type = 'line',
        this.points = [
        new Point({index:0, name:"P-1", parent:this.name, left:175, top:175, fill:this.color, stroke:this.color, lockMovementX: true, canvas:this.canvas}),
        new Point({index:1, name:"P-2", parent:this.name, left:175, top:500, fill:this.color, stroke:this.color, lockMovementX: true, canvas:this.canvas})
        ];   
    }
    Shape.prototype.HorizontalLine = function(){
        this.type = 'line';
        this.points = [
        new Point({index:0, name:"P-1", parent:this.name, left:175, top:175, fill:this.color, stroke:this.color, lockMovementY: true, canvas:this.canvas}),
        new Point({index:1, name:"P-2", parent:this.name, left:500, top:175, fill:this.color, stroke:this.color, lockMovementY: true, canvas:this.canvas})
        ];      
    }
    Shape.prototype.Draw = function () {
        var dlines = {};
        if (this.type == "line" || this.type == "verticalLine" || this.type=="horizontalLine") {
            var line = new fabric.Line([this.points[0].left, this.points[0].top, this.points[1].left, this.points[1].top], {
                name: this.name,
                parent: this.name,
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
                if (i !== (this.points.length - 1)){
                    line = new fabric.Line([this.points[i].left, this.points[i].top, this.points[i + 1].left, this.points[i + 1].top], 
                        { name: "line"+i, parent: this.name, fill: this.color, strokeWidth: 2, stroke: this.color, selectable: false, hasControls:false, hasBorders: false, hasRotatingPoint: false, hoverCursor: this.hoverCursor }); 
                }else{
                    line = new fabric.Line([this.points[i].left, this.points[i].top, this.points[0].left, this.points[0].top], 
                        { name: "line"+i, parent: this.name, fill: this.color, strokeWidth: 2, stroke: this.color, selectable: false, hasControls:false, hasBorders: false, hasRotatingPoint: false, hoverCursor: this.hoverCursor }); 
                }
                dlines[line.name] = line;
                this.canvas.add(line);
            }

            var arrLine = [];
            Object.keys(dlines).forEach(function(key) {
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
    Shape.prototype.Move = function(params){
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
        if(point){
            // if (point.get('type') === "text") {
            //     this.lbX = point.left;
            //     this.lbY = point.top;
            // }
            for (var i = 0; i < this.points.length; i++) {
                if (point.name === this.points[i].name) {
                    this.points[i].left = point.left;
                    this.points[i].top = point.top;
                    break;
                }
            }
            this.lbX = this.points[0].left + 5;
            this.lbY = this.points[0].top - 30;
        }else{
            this.GetNewCoodr(offsetX, offsetY);
        }
        this.Draw();
    }
    Shape.prototype.FillInside = function(){
        var pathDirection = 'M';
        this.points.forEach(function(p){
            pathDirection += ' ' + p.left + ' ' + p.top +' L';
        });
        pathDirection += ' z';
        var path = new fabric.Path(pathDirection);
        path.set({name: 'i-'+this.name, parent: this.name, opacity: 0, hasControls:false, hasBorders: false, hasRotatingPoint: false});
        if (this.type === "line"){
            if(this.points[0].lockMovementY || this.points[0].lockMovementX){
                path.set({strokeWidth: 5});    
            }else{
                path.set({strokeWidth: 1});
            }
        }
        this.canvas.add(path);
    };
    Shape.prototype.Rename = function (newName) {
        var oldName = this.name;
        this.name = newName;
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].parent = newName;
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
    Shape.prototype.AddPoint = function(p){
        this.AddPointMode = true;
        var dmin = Math.sqrt((p.top - this.points[0].top)*(p.top - this.points[0].top) + (p.left - this.points[0].left)*(p.left - this.points[0].left));
        var p1 = this.points[0];
        var p2;
        var lstPoint = [];
        this.points.forEach(function(p){
            lstPoint.push(p);
        });
        var k = 1;
        while (k <= 2){
            for(var i=0; i < lstPoint.length; i++){
                var d = Math.sqrt((p.top - lstPoint[i].top)*(p.top - lstPoint[i].top) + (p.left - lstPoint[i].left)*(p.left - lstPoint[i].left));
                if(d < dmin){
                    dmin = d;
                    if (k !== 2)
                        p1 = lstPoint[i];
                    else
                        p2 = lstPoint[i];
                }
            }
            if (k === 1){
                lstPoint.splice(lstPoint.indexOf(p1), 1);
                p2 = lstPoint[0];
                dmin = Math.sqrt((p.top - lstPoint[0].top)*(p.top - lstPoint[0].top) + (p.left - lstPoint[0].left)*(p.left - lstPoint[0].left));                
            }
            k++;    
        }
        var name, index;
        if (p1.index === this.points[0].index && p2.index === this.points[this.points.length - 1].index){
            index = p2.index + 1;
            name = "P-" + (index + 1);
        }else if ((p1.index === this.points[this.points.length - 1].index) && (p2.index === this.points[0].index)){
            index = p1.index + 1;
            name = "P-" + (index + 1);
        }else{
            if(p1.index < p2.index){
                index = p2.index;
                name = "P-" + (index + 1);
                p2.index += 1;
                p2.name = "P-" + (p2.index + 1);
            }else{
                index = p1.index;
                name = "P-" + (index + 1);
                p1.index += 1;
                p1.name = "P-" + (p1.index + 1);
                
            }    
            for(var i=(p1.index < p2.index)? p2.index:p1.index; i <= (this.points.length - 1); i++){
                this.points[i].index +=1;
                this.points[i].name = "P-"+(this.points[i].index + 1);
            }
        }
        
        
        p.name = name; 
        p.index = index;
        p.parent = this.name;
        p.fill = this.color;
        p.stroke = this.color;
        p.canvas = this.canvas;
        this.Remove();
        this.points.push(p);
        this.points.sort(this.compare);
        this.Draw();
        this.canvas.renderAll();
    };
    Shape.prototype.compare = function(a, b){
        const indexA = a.index;
        const indexB = b.index;
        var comparison = 0;
        if (indexA > indexB){
            comparison = 1;
        }else if (indexA < indexB){
            comparison = -1;
        }
        return comparison;
    };
    Shape.prototype.Remove = function () {  
        var objs = this.canvas.getItem('',this.name); 
        for (var i=0; i < objs.length; i++){
            this.canvas.remove(objs[i]);
        }
    };
    Shape.prototype.RemovePoint = function (name){
        if(this.points.length === 3){
            return;
        }
        var p;
        for(var i=0; i < this.points.length; i++){
            if(p){
                if(p.index !== this.points.length){
                    this.points[i].index -= 1;
                    this.points[i].name = "P-" + (this.points[i].index+1); 
                }
            }
            if (!p && this.points[i].name === name){
                p = this.points[i];
            }
        }
        this.Remove();
        this.points.splice(this.points.indexOf(p), 1);
        this.Draw();
    }
    Shape.prototype.Convex = function(){//Kiem tra da giac loi
        var y1,y2;
        var totalAngle = 0;
        for(var i=0; i<this.points.length;i++){
            if(i===0){
                y1 = i + 1;
                y2 = this.points.length - 1;
            }else if(i===(this.points.length - 1)){
                y1 = 0;
                y2 = i -1;
            }else{
                y1 = i + 1;
                y2 = i - 1;
            }

            var a = Math.sqrt((this.points[i].top - this.points[y1].top)*(this.points[i].top - this.points[y1].top) +
                (this.points[i].left - this.points[y1].left)*(this.points[i].left - this.points[y1].left));
            var b = Math.sqrt((this.points[i].top - this.points[y2].top)*(this.points[i].top - this.points[y2].top) +
                (this.points[i].left - this.points[y2].left)*(this.points[i].left - this.points[y2].left));
            var c = Math.sqrt((this.points[y1].top - this.points[y2].top)*(this.points[y1].top - this.points[y2].top) +
                (this.points[y1].left - this.points[y2].left)*(this.points[y1].left - this.points[y2].left));
            var ang = Math.round(Math.acos((a*a + b*b - c*c)/(2*a*b))*(180/Math.PI));
            totalAngle += ang;
        }
        if (totalAngle === ((this.points.length-2)*180)) {

            return  true;
        }else{
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
    Shape.prototype.Inside = function(p){//kiem tra 1 diem co nam trong da giac
        var totalAngle = 0;
        var p1 =this.points[0];
        var i1,i2;
        var type = "convex";
        
        for(var i=0; i<this.points.length;i++){
           var p1 = this.points[i];
           var p2;
           if (p1.index === this.points.length - 1){
            p2 = this.points[0];
        }else{
            p2 = this.points[i + 1];
        }
        var a = Math.sqrt((p.top - p1.top)*(p.top - p1.top) + (p.left - p1.left)*(p.left - p1.left));
        var b = Math.sqrt((p.top - p2.top)*(p.top - p2.top) + (p.left - p2.left)*(p.left - p2.left));
        var c = Math.sqrt((p1.top - p2.top)*(p1.top - p2.top) + (p1.left - p2.left)*(p1.left - p2.left));
        var ang = Math.round(Math.acos((a*a + b*b - c*c)/(2*a*b))*(180/Math.PI));
        totalAngle += ang;
    }
    if (totalAngle === 360) {
        return  true;
    }else{
        return false;
    }
};
    Shape.prototype.Centroid = function(){//tinh toa do trong tam
        var nPts = this.points.length;
        var x=0; var y=0;
        var f;
        var j=nPts-1;
        var p1; var p2;

        for (var i=0;i<nPts;j=i++) {
            p1=this.points[i]; p2=this.points[j];
            f=p1.left*p2.top-p2.left*p1.top;
            x+=(p1.left + p2.left)*f;
            y+=(p1.top + p2.top)*f;
        }
        f=this.Area()*6;
        return new Point("G", this.name, x/f, y/f, 5, this.color, 1, this.color, "", "", false, false, -2);
    };
    Shape.prototype.Area = function() {//tinh dien tich
        var area=0;
        var nPts = this.points.length;
        var j=nPts-1;
        var p1; var p2;
        for (var i=0;i<nPts;j=i++) {
            p1=this.points[i]; 
            p2=this.points[j];
            area+=p1.left*p2.top;
            area-=p1.top*p2.left;
        }
        area/=2;

        return area;
    };
    Shape.prototype.CCW = function(p1, p2, p3){//kiem tra doan thang p2p3 sang trai hay phai so vs doan p1p2 ; -1 sang trai, 1 sang phai, 0 thang hang
        var a1, b1, a2, b2, t;
        a1 = p2.left - p1.left;
        b1 = p2.top - p1.top;
        a2 = p3.left - p2.left;
        b2 = p3.top - p2.top;
        t = a1*b2 - a2*b1;
        if (Math.abs(t) < Number.EPSILON)
            return 0;
        else{
            if(t>0)
                return 1;
            else
                return -1;
        }
    };
    Shape.prototype.Intersect = function(p1l1, p2l2, p1l2, p2l2){//Check 2 duong thang cat nhau
        var a1,b1,c1,a2,b2,c2,t1,t2;
        var f1 = this.Extract(p1l1, p2l2);
        var f2 = this.Extract(p2l1, p2l2);
        a1 = f1.a;b1 = f1.b; c1 = f1.c;
        a2 = f2.a;b2 = f2.b; c2 = f2.c;
        t1 = (p1l1.left*a2+p1l1.top*b2+c2)*(p1l1.left*a2+p2l1.top*b2+c2);
        t2 = (p1l1.left*a1+p1l1.top*b1+c1)*(p2l1.left*a1+p2l1.top*b1+c1);
        return (t1 < Number.EPSILON && t2 < Number.EPSILON)? true : false;
    };
    Shape.prototype.Extract = function(p1, p2){//xay dung phuong trinh duong thang ax+by+c=0, tra ve a,b,c
        var a = p1.top - p2.top;
        var b = p1.left - p2.left;
        var c = -(a*p1.left + b*p1.top);
        return {
            a:a,b:b,c:c
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
vcanvas.prototype.getItem = function (name, parent) {
    var object = null, objects = this.canvas.getObjects();
    var os = [];
    for (var i = 0, len = this.canvas.size(); i < len; i++) {
        if (parent) {
            if(name){
                if (objects[i].name && objects[i].name === name && objects[i].parent === parent) {
                    object = objects[i];
                    break;
                }
            }else{
                if (objects[i].parent === parent) {
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
    return (name)?object:os;
};
var getRandomInt = function (start, end) { return Math.floor(Math.random() * end) + start; }
var getRandomColor = function () { return (pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2));}
var pad = function (str, length) {
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}
var getRandomNum = function (min, max) { return Math.random() * (max - min) + min; }
fabric.Canvas.prototype.getItem = function (name, parent) {
    var object = null, objects = this.getObjects();
    var os = [];
    for (var i = 0, len = this.size(); i < len; i++) {
        if (parent) {
            if(name){
                if (objects[i].name && objects[i].name === name && objects[i].parent === parent) {
                    object = objects[i];
                    break;
                }
            }else{
                if (objects[i].parent === parent) {
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
    return (name)?object:os;
};