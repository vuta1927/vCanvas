class Point {
	left:number
	top:number
	fill:string
	radius:number
	name:string
    strokeWidth:number
    stroke:string
    line1:string
    line2:string
    parent:string
    lockMovementX:boolean = false
    lockMovementY:boolean = false
    constructor(name:string,parent:string,left:number,top:number,radius:number,
    	fill:string,strokeWidth:number,stroke:string,line1:string,line2:string,
    	lockMovementX:boolean,lockMovementY:boolean){
    	this.name = name
    	this.parent = parent
    	this.left=left
    	this.top = top
    	this.radius = radius
    	this.fill = fill
    	this.strokeWidth = strokeWidth
    	this.stroke = stroke
    	this.line1 = line1
    	this.line2 = line2
    	this.lockMovementX = lockMovementX
    	this.lockMovementY = lockMovementY
    }
    Draw(lines):void{
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
    }
}

class Shape {
	name:string
	points:Point[]
	lines:string[]
	type:string
	color:string
	lbX:number
	lbY:number
	constructor(name:string, type:string, points:Point[], color:string){
		this.name = name
		this.type = type
		this.points = points
		this.color = color
	}
    DrawLabel():void{
        if (!this.lbX && !this.lbY)
        {
            for(var i=0; i < this.points.length; i++){
                if(this.points[i].name == "A"){
                    this.lbX = this.points[i].left
                    this.lbY = this.points[i].top - 30
                    break
                }
            }
        }
        var label = new fabric.Text(this.name,{ name: "lb-" + this.name, parent: this.name, left: this.lbX, top: this.lbY, 
            fontSize: 20, fontFamily: "calibri", fill: this.color, hasRotatingPoint: false, centerTransform: true});
        label.hasControls = label.hasBorders = false
        canvas.add(label)
    }
    Draw():void{
        var lines = {}
            if (this.type == "line") {
                var line = new fabric.Line([this.points[0].left, this.points[0].top, this.points[1].left, this.points[1].top],
                    {
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
                lines[line.name] = line;
                canvas.add(line);
            } else {
                var line1 = new fabric.Line([this.points[0].left, this.points[0].top, this.points[3].left, this.points[3].top],
                    { name: "line1", parent: this.name, fill: this.color, strokeWidth: 2, stroke: this.color, selectable: false });
                var line2 = new fabric.Line([this.points[1].left, this.points[1].top, this.points[0].left,this.points[0].top],
                    { name: "line2", parent: this.name, fill: this.color, strokeWidth: 2, stroke: this.color, selectable: false });
                var line3 = new fabric.Line([this.points[1].left, this.points[1].top, this.points[2].left,this.points[2].top],
                    { name: "line3", parent: this.name, fill: this.color, strokeWidth: 2, stroke: this.color, selectable: false });
                var line4 = new fabric.Line([this.points[3].left, this.points[3].top, this.points[0].left, this.points[0].top],
                    { name: "line4", parent: this.name, fill: this.color, strokeWidth: 2, stroke: this.color, selectable: false });
                lines[line1.name] = line1;
                lines[line2.name] = line2;
                lines[line3.name] = line3;
                lines[line4.name] = line4;
                this.lines = [line1.name, line2.name, line3.name, line4.name];
                canvas.add(line1, line2, line3, line4);
            }
            for (var i = 0; i < this.points.length; i++) {
                    this.points[i].Draw(lines);
            }
            this.DrawLabel()
    }
    Rename(newName:string):Shape{
        var oldName = this.name
        this.name = newName
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].parent = newName
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
        return this
    }
    Remove():void{
        for (var j = 0; j < this.points.length; j++) {
            canvas.remove(canvas.getItem(this.points[j].name, this.name));
        }
        for (var j = 0; j < this.lines.length; j++) {
            canvas.remove(canvas.getItem(this.lines[j], this.name));
        }
        canvas.remove(canvas.getItem("lb-" + this.name, this.name));
        //lstDrawObject.splice(lstDrawObject.indexOf(lstDrawObject[i]), 1);
    }
    GetNewCoodr(x:number, y:number):void{
        var a:number, b:number
        var basePoint:Point = this.points[0]

        a = x - basePoint.left
        b = y - basePoint.top

        for (var i = 0; i < this.points.length; ++i) {
            if (this.points[i].name == "A")
            {
                basePoint = this.points[i]
                this.points[i].left = x
                this.points[i].top = y
                continue
            }
            this.points[i].left += a
            this.points[i].top += b
        }
        this.lbX += a
        this.lbY += b
    }
}

fabric.Canvas.prototype.getItem = function (name, parent) {
    var object = null,
    objects = this.getObjects();
    for (var i = 0, len = this.size() ; i < len; i++) {
        if (parent) {
            if (objects[i].name && objects[i].name === name && objects[i].parent === parent) {
                object = objects[i];
                break;
            }
        } else {
            if (objects[i].name && objects[i].name === name) {
                object = objects[i];
                break;
            }
        }
    }
    return object;
};