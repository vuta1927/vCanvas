var vCanvas;
$(window).load(function(){
	vCanvas = new vcanvas({parent: 'wrapper', tableParent:'table'});
	var JsonTest = '{"parent":"wrapper","tableParent":"table","backgroundUrl":null,"Shapes":[{"index":1,"name":"Rect-1","type":"rect","points":[{"index":0,"name":"P-1","parent":"Rect-1","left":791,"top":158,"radius":5,"fill":"#5aa4c8","strokeWidth":1,"stroke":"#5aa4c8","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0},{"index":1,"name":"P-2","parent":"Rect-1","left":966,"top":158,"radius":5,"fill":"#5aa4c8","strokeWidth":1,"stroke":"#5aa4c8","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0},{"index":2,"name":"P-3","parent":"Rect-1","left":966,"top":283,"radius":5,"fill":"#5aa4c8","strokeWidth":1,"stroke":"#5aa4c8","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0},{"index":3,"name":"P-4","parent":"Rect-1","left":791,"top":283,"radius":5,"fill":"#5aa4c8","strokeWidth":1,"stroke":"#5aa4c8","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0},{"index":4,"name":"P-5","parent":"Rect-1","left":605.7142857142858,"top":293.9807549962991,"radius":5,"fill":"#5aa4c8","strokeWidth":1,"stroke":"#5aa4c8","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0}],"color":"#5aa4c8","isMoving":false,"hoverCursor":"pointer","x":878.5,"y":220.5,"lines":["line0","line1","line2","line3","line4"],"lbX":796,"lbY":128,"AddPointMode":false},{"index":2,"name":"Line-1","type":"line","points":[{"index":0,"name":"P-1","parent":"Line-1","left":175,"top":175,"radius":5,"fill":"#59cb0d","strokeWidth":1,"stroke":"#59cb0d","hoverCursor":"pointer","lockMovementX":true,"lockMovementY":false,"lbX":0,"lbY":0},{"index":1,"name":"P-2","parent":"Line-1","left":175,"top":500,"radius":5,"fill":"#59cb0d","strokeWidth":1,"stroke":"#59cb0d","hoverCursor":"pointer","lockMovementX":true,"lockMovementY":false,"lbX":0,"lbY":0}],"color":"#59cb0d","isMoving":false,"hoverCursor":"pointer","lines":["Line-1"],"lbX":180,"lbY":145,"AddPointMode":false},{"index":3,"name":"Rect-2","type":"rect","points":[{"index":0,"name":"P-1","parent":"Rect-2","left":384,"top":246,"radius":5,"fill":"#890806","strokeWidth":1,"stroke":"#890806","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0},{"index":1,"name":"P-2","parent":"Rect-2","left":559,"top":246,"radius":5,"fill":"#890806","strokeWidth":1,"stroke":"#890806","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0},{"index":2,"name":"P-3","parent":"Rect-2","left":695.7142857142859,"top":369.61658031088086,"radius":5,"fill":"#890806","strokeWidth":1,"stroke":"#890806","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0},{"index":3,"name":"P-4","parent":"Rect-2","left":559,"top":371,"radius":5,"fill":"#890806","strokeWidth":1,"stroke":"#890806","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0},{"index":4,"name":"P-5","parent":"Rect-2","left":384,"top":371,"radius":5,"fill":"#890806","strokeWidth":1,"stroke":"#890806","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0}],"color":"#890806","isMoving":false,"hoverCursor":"pointer","x":539.8571428571429,"y":307.80829015544043,"lines":["line0","line1","line2","line3","line4"],"lbX":389,"lbY":216,"AddPointMode":false}],"units":70,"startX":0,"startY":0,"tempPoint":null,"LineHovered":null,"ActiveObject":{"index":3,"name":"Rect-2","type":"rect","points":[{"index":0,"name":"P-1","parent":"Rect-2","left":384,"top":246,"radius":5,"fill":"#890806","strokeWidth":1,"stroke":"#890806","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0},{"index":1,"name":"P-2","parent":"Rect-2","left":559,"top":246,"radius":5,"fill":"#890806","strokeWidth":1,"stroke":"#890806","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0},{"index":2,"name":"P-3","parent":"Rect-2","left":695.7142857142859,"top":369.61658031088086,"radius":5,"fill":"#890806","strokeWidth":1,"stroke":"#890806","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0},{"index":3,"name":"P-4","parent":"Rect-2","left":559,"top":371,"radius":5,"fill":"#890806","strokeWidth":1,"stroke":"#890806","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0},{"index":4,"name":"P-5","parent":"Rect-2","left":384,"top":371,"radius":5,"fill":"#890806","strokeWidth":1,"stroke":"#890806","hoverCursor":"pointer","lockMovementX":false,"lockMovementY":false,"lbX":0,"lbY":0}],"color":"#890806","isMoving":false,"hoverCursor":"pointer","x":539.8571428571429,"y":307.80829015544043,"lines":["line0","line1","line2","line3","line4"],"lbX":389,"lbY":216,"AddPointMode":false},"prevSelected":null,"url":"http://demo111.websieuviet.com/file/pic/newsletter/2016/04/e28a8b1cb936c443d2d1cde95483e92201179.jpg","background":{"url":"http://demo111.websieuviet.com/file/pic/newsletter/2016/04/e28a8b1cb936c443d2d1cde95483e92201179.jpg","width":1920,"height":1080},"panning":false,"isDrawing":false,"isMouseDown":false,"AddPointMode":false}';
	vCanvas.init({js:JsonTest});
	$('#btnChangeBackgroundSave').click(function(){
		url = $('#txtImgUrl').val();
		if(url){
			$('#myModal').modal('hide');
			$('#modalError').text("");
			vCanvas.LoadBackground({url: url});
		}else{
			$('#myModal').modal('show');
			$('#modalError').text("");
			$('#modalError').text("Image url cannot be empty. Please enter your image url!");
		}

	})
	$('#btnAddRect').click(function(){
		vCanvas.Add({type:"rect"});
	});

	$('#btnAddVerticalLine').click(function(){
		vCanvas.Add({type:"verticalLine"});
	});

	$('#btnAddHorizontalLine').click(function(){
		vCanvas.Add({type:"horizontalLine"});
	});

	$('#btnDrawLine').click(function(){
		vCanvas.isDrawing = true;
	});
	$('#btnExport').click(function(){
		var js = vCanvas.ToJson();
		console.log(js);
		$('#txtData').val(js);
	});
	$('#btnResetZoom').click(function(){
		vCanvas.canvas.viewportTransform = [1,0,0,1,0,0];
		vCanvas.canvas.renderAll();
	})
	$('#btnZoomIn').click(function(){
		vCanvas.canvas.setZoom(vCanvas.canvas.getZoom() * 1.1 ) ;
	})
	$('#btnZoomOut').click(function(){
		vCanvas.canvas.setZoom(vCanvas.canvas.getZoom() / 1.1 ) ;
	})
	$('#btnLoad').click(function(){
		var js = $("#txtData").val();
		vCanvas.init({js});
	});

});


function ValidateKey(){
	var key=window.event.keyCode;
	var allowed='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-.0123456789';
	return allowed.indexOf(String.fromCharCode(key)) !=-1 ;
}
var prevSelected;
function ShowShapeDetail(element, event){
	if (!prevSelected){
		element.className = "hideDetail fa fa-minus";	
		prevSelected = element;
		element.parentElement.parentElement.nextElementSibling.hidden=false;
	}else{
		var prevId = prevSelected.className.split(' ')[0];
		var currId = element.className.split(' ')[0];
		if (prevId === currId === "showDetail"){
			prevSelected.parentElement.parentElement.hidden=true;
			prevSelected.className = "showDetail fa fa-plus";

			element.className = "hideDetail fa fa-minus";	
			prevSelected = element;
			element.parentElement.parentElement.nextElementSibling.hidden=false;	
		}else if(prevId === currId === "hideDetail"){
			prevSelected.parentElement.parentElement.hidden=true;
			prevSelected.className = "showDetail fa fa-plus";

			element.className = "hideDetail fa fa-plus";	
			prevSelected = null;
			element.parentElement.parentElement.nextElementSibling.hidden=true;	
		}
		else if (prevId !== currId){
			if(currId === "showDetail"){
				element.className = "hideDetail fa fa-minus";	
				prevSelected = element;
				element.parentElement.parentElement.nextElementSibling.hidden=false;	
			}else{
				element.className = "showDetail fa fa-plus";	
				prevSelected = null;
				element.parentElement.parentElement.nextElementSibling.hidden=true;	
			}
		}else{
			prevSelected = element;
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
}
function showPointDetail(e){
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
}
function onInputClicked(e){
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
}
function onChangeAddPoint(e) {
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
		vCanvas.loadDataToTable();
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
}
function onPointRemoveClick(e){
	var parent = e.parentElement.parentElement.cells[0].innerText;
	var name = e.parentElement.parentElement.cells[1].innerText;
	var obj = vCanvas.Get(parent);
	obj.RemovePoint(name);
	vCanvas.loadDataToTable();
}

function onRemoveShapeClicked(e){
	var name = e.parentElement.parentElement.cells[1].firstChild.value;
	vCanvas.Remove(name);
	vCanvas.loadDataToTable();
}
function textChange(element, newValue) {
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
}