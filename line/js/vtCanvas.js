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
            lbY: 0

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

    }
    Point.prototype.Draw = function () {
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
        if (this.lockMovementX)
            p.set({ lockMovementX: true });
        if (this.lockMovementY)
            p.set({ lockMovementY: true });
        p.hasControls = p.hasBorders = false;
        canvas.add(p);
    };
    Point.prototype.DrawPointLabel = function () {
        if (this.lbX === 0 && this.lbY === 0) {
            this.lbX = this.left + 10;
            this.lbY = this.top + 10;
        }
        var text = this.name + " ("+(this.left/canvas.getWidth())*100+", "+(this.top/canvas.getHeight())*100+")";
        var label = new fabric.Text(text, {name: "lb-" + this.name + "-" + this.parent ,parent: this.name, left: this.lbX, top: this.lbY,
            fontSize: 15, fontFamily: "calibri", fill: this.color, hasRotatingPoint: false, 
            centerTransform: true, selectable:true });
        label.hasControls = label.hasBorders = false;
        canvas.add(label);
    };

    Point.prototype.HidePointLabel = function (){
        var lb = canvas.getItem("lb-" + this.name + "-" + this.parent, this.name);
        canvas.remove(lb);
    }
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
            AddPointMode: false
        }, params);
        this.index = properties.index;
        this.name = properties.name;
        this.type = properties.type;
        this.points = properties.points;
        this.color = properties.color;
        this.isMoving = properties.isMoving;
        this.hoverCursor = properties.hoverCursor;
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
        canvas.add(label);
    };
    Shape.prototype.Rect = function (){
        this.type = 'rect';
        this.points = [
        new Point({index:0, name:"P-1", parent:this.name, left:175, top:175, fill:this.color, stroke:this.color}),
        new Point({index:1, name:"P-2", parent:this.name, left:350, top:175, fill:this.color, stroke:this.color}),
        new Point({index:2, name:"P-3", parent:this.name, left:350, top:300, fill:this.color, stroke:this.color}),
        new Point({index:3, name:"P-4", parent:this.name, left:175, top:300, fill:this.color, stroke:this.color})
        ];
    }
    Shape.prototype.VerticalLine = function(){
        this.type = 'line',
        this.points = [
        new Point({index:0, name:"P-1", parent:this.name, left:175, top:175, fill:this.color, stroke:this.color, lockMovementX: true}),
        new Point({index:1, name:"P-2", parent:this.name, left:175, top:500, fill:this.color, stroke:this.color, lockMovementX: true})
        ];   
    }
    Shape.prototype.HorizontalLine = function(){
        this.type = 'line';
        this.points = [
        new Point({index:0, name:"P-1", parent:this.name, left:175, top:175, fill:this.color, stroke:this.color, lockMovementY: true}),
        new Point({index:1, name:"P-2", parent:this.name, left:500, top:175, fill:this.color, stroke:this.color, lockMovementY: true})
        ];      
    }
    Shape.prototype.Draw = function () {
        var dlines = {};
        if (this.type == "line") {
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
            canvas.add(line);
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
                canvas.add(line);
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
            this.points[i].Draw();
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
        canvas.add(path);
    };
    Shape.prototype.Rename = function (newName) {
        var oldName = this.name;
        this.name = newName;
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].parent = newName;
            var p = canvas.getItem(this.points[i].name, oldName);
            canvas.remove(p);
        }
        for (var j = 0; j < this.lines.length; j++) {
            var line = canvas.getItem(this.lines[j], oldName);
            canvas.remove(line);
        }
        var label = canvas.getItem("lb-" + oldName);
        canvas.remove(label);
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
        this.Remove();
        this.points.push(p);
        this.points.sort(this.compare);
        this.Draw();
        canvas.renderAll();
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
        var objs = canvas.getItem('',this.name); 
        objs.forEach(function(o){canvas.remove(o);});
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
var shapeType = {3:"triangle", 4:'rectangle', 5:'pentagon', 6:'hexagon',7:'polygon'};
function getRandomInt(start, end) { return Math.floor(Math.random() * end) + start; }
function getRandomColor() { return (pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2));}
function pad(str, length) {
    while (str.length < length) {
        str = '0' + str;
    }
    return str;}
    function getRandomNum(min, max) { return Math.random() * (max - min) + min; }

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
