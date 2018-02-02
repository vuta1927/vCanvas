var vCanvas = (function () {
    var vCanvas = {}
    vCanvas.types = {
        Rect: 100,
        Line: 200,
        HLine: 201,
        VLine: 202
    };
    vCanvas.columnTypes = {
        Text: 100,
        Number: 200,
        Combobox: 300,
        Checkbox: 400
    };
    vCanvas.colors = {
        Rect: '#ff00ff',
        Line: '#00ff00',
        VerticalLine: '#0066ff',
        HorizontalLine: '#ffff00'
    };
    vCanvas.canvasCollection = [];

    var CanvasControl = (function(){
        CanvasControl = function(params){
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
                randomColor: null
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
        }

        vCanvas.Point = (function () {
            var Point = {}
            function Draw (){
    
            }
            Point.Create = function (params) {
                var options = $.extend({
                    index: null,
                    name: null,
                    parentName: null,
                    left: 0,
                    top: 0,
                    fill: null,
                    stroke: null,
                    lockMovementX: false,
                    lockMovementY: false
                }, params);
                Point.index = options.index;
                Point.name = options.name;
                Point.parentName = options.parentName;
                Point.left = options.left;
                Point.top = options.top;
                Point.fill = options.fill;
                Point.stroke = options.stroke;
                Point.lockMovementX = options.lockMovementX;
                Point.lockMovementY = options.lockMovementY;
                return Point;
            }
            Point.GetName = function () {
                return Point.name;
            }
            return Point;
        })()
    })()

    vCanvas.Create = function(params){
        var newControl = new CanvasControl();
        var options = $.extend({
            json: null,
            parent: null,
            backgroundUrl: null,
            types: [],
            extColumns: [],
            maxShape: null,
            randomColor: false,
        },params);
        newControl.json = options.json;
        newControl.parentId = options.parent;
        newControl.backgroundUrl = options.backgroundUrl;
        newControl.types = options.types;
        newControl.extColumns = options.extColumns;
        newControl.maxShape = options.maxShape;
        newControl.randomColor = options.randomColor;
        vCanvas.canvasCollection.push(newControl);
    }
    return vCanvas;
})()