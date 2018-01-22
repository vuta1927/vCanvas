import { fabric } from "./fabric";
import { open } from "inspector";

vCanvas.TYPES = {
    Rect: 100,
    Line: 200,
    HLine: 201,
    VLine: 202
};

vCanvas.COLTYPES = {
    Text: 100,
    Number: 200,
    Combobox: 300,
    Checkbox: 400
};
vCanvas.Collection = [];

var ExtendColumns = (function(){
    function ExtendColumns(params){
        var options = $.extend({
            name: null,
            type: null,
            data: null
        }, params);
        this.name = options.name;
        this.type = options.type;
        this.data = options.data;
        return this;
    }
    return ExtendColumns;
})()

var vCanvas = (function(){
    function Create(params){
        var options = $.extend({
            id: null,
            json: null,
            parent: null,
            imageUrl: null,
            types: [],
            extendColumns: []
        }, params);
        var id = options.id;
        var json = options.json;
        var data = options.data;
        var parent = options.parent;
        var imageUrl = options.imageUrl;
        var canvasTypes = options.types;
        var extendColumns = options.extendColumns;
    }
})()


var Point = (function(){
    var myConfig = {
        radius: 3,
        strokeWidth:1,
        stroke: "black",
        hoverCursor: "pointer",
    }
    function Point(params){
        var options = $.extend({
            index: null,
            name: null,
            color: null,
            x: 0,
            y: 0,
        }, params);
        this.index = options.index;
        this.name = options.name;
        this.color = options.color;
        this.x = options.x;
        this.y = options.y;
    }
    return point;
})()

var Shape = (function(){
    var myConfig = {
        radius: 3,
        strokeWidth:1,
        stroke: "black",
        hoverCursor: "pointer",
        color: null,
        labelX: 0,
        labelY: 0,
        isMoving: false,
        AddPointMode: false
    }
    function Shape(params){
        var options = $.extend({
            index: null,
            name: null,
            type: null,
            points: []
        }, params);
        this.index = options.index;
        this.name = options.name;
        this.type = options.type;
        this.points = options.points;
    }
    return Shape;
})()

Shape.prototype.types = vCanvas.TYPES;

Shape.prototype.init = function(){
    var type = this.type;
    if(type == this.types.Rect){
        var p1 = new Point({
            index: 0,
            name: "P-1",
            x: 175,
            y: 175,
            color: this.color
        });
        var p2 = new Point({
            index: 1,
            name: "P-2",
            x: 350,
            y: 175,
            color: this.color
        });
        var p3 = new Point({
            index: 2,
            name: "P-3",
            x: 350,
            y: 300,
            color: this.color
        });
        var p4 = new Point({
            index: 3,
            name: "P-4",
            x: 175,
            y: 300,
            color: this.color
        });
        this.points = [p1,p2,p3,p4];
    }else if(type == this.types.VerticalLine){

    }else if(type == this.types.ForizontalLine){

    }else if(type == this.types.Line){

    }
}