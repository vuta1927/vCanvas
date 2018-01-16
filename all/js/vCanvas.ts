class vCanvas{
	point: Point
	constructor(point){
		this.point = point
	}
}
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