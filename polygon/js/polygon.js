
var Shapes = [];
var canvas, imgWidth, imgHeight;
var currentObj, isDrawing = false, isMouseDown = false, panning = false, AddPointMode = false;
var OrginCanvasWidth, OrginCanvasHeight;
var units = 70;
var startX, startY;
var tempPoint, LineHovered;
var prevSelected;
var img;
$(window).load(function(){
	$('#btnChangeBackgroundSave').click(function(){
		loadBackground();
	})
	$('#btnAddRect').click(function(){
		var result = randomName("rect");
		var newShape = new Shape({name:result.name, index: result.index});
		newShape.Rect();
		newShape.Draw();
		Shapes.push(newShape);
		loadDataToTable();
	});
	$('#btnExport').click(function(){
		var js = JSON.stringify(Shapes);
		$("#txtData").val(js);
		console.log(js);
	});
	$('#btnResetZoom').click(function(){
		canvas.viewportTransform = [1,0,0,1,0,0];
		canvas.renderAll();
	})
	$('#btnZoomIn').click(function(){
		canvas.setZoom(canvas.getZoom() * 1.1 ) ;
	})
	$('#btnZoomOut').click(function(){
		canvas.setZoom(canvas.getZoom() / 1.1 ) ;
	})
	$('#btnLoad').click(function(){
		loadBackground(url);
		canvas.clear();
		Shapes = [];
		var js = $("#txtData").val();
		var RawData = JSON.parse(js);
		for (var i = 0; i < RawData.length; i++) {
			var points = [];
			RawData[i].points.forEach(function(p){
				points.push(new Point({name: p.name, parent: p.parent, left: p.left, top: p.top, radius: p.radius, fill: p.fill, strokeWidth:p.strokeWidth, stroke: p.stroke, lockMovementX: p.lockMovementX, lockMovementY: p.lockMovementY, index: p.index}));
			});
			
			var newShape = new Shape({name: RawData[i].name,type: RawData[i].type,points: points, color: RawData[i].color});
			newShape.lbX = RawData[i].lbX;
			newShape.lbY = RawData[i].lbY;
			Shapes.push(newShape);
			newShape.Draw();
		}
	});
	
	initCanvas();

	$(canvas.wrapperEl).on('mousewheel', function (e) {
		var delta = e.originalEvent.wheelDelta / 500;
		var pointer = canvas.getPointer(e.e);
		// console.log(e.offsetX, e.offsetY);
		var currentWidth = canvas.getWidth();
		var currentHeight = canvas.getHeight();
		console.log(canvas.getWidth(), canvas.getHeight());
		if (delta > 0 ) {
			canvas.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), canvas.getZoom() * 1.1);
		}
		if (delta < 0 ){
			canvas.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), canvas.getZoom() / 1.1);
		}
		return false;
	});
	canvas.on({
		'touch:drag': function(e) {
		}
	});
	canvas.on({
		'mouse:down': function (o) {
			pointer = canvas.getPointer(o.e);
			x0 = pointer.x;
			y0 = pointer.y;
			if((o.e.type === 'touchmove') && (o.e.touches.length > 1)) { return; }
			
			var obj = o.target;
			if (AddPointMode){
				var newPoint = new Point({left:x0, top:y0});
				currentObj.AddPoint(newPoint);
			}else {
				var obj = o.target;
				if (!obj || obj.get('type') === "image") {
					panning = true;
					// canvas.defaultCursor = "all-scroll";
					var allObject = canvas.getObjects();
					for (var i = 0; i < allObject.length; i++) {
						if (allObject[i].get('type') === "circle") {
							allObject[i].set({ radius: 5 });
						}
					}
				}
			}
		},
		'mouse:move': function (o) {
			if (panning && o && o.e && panning) {
				if (o.e.type !== "touchmove"){
					var delta = new fabric.Point(o.e.movementX, o.e.movementY);
					canvas.relativePan(delta);
				}
			}
		},
		'mouse:over': function (e) {
			var c = e.target;
			if (c){
				if ( c.get('type') == "image") {
					c.set({ hoverCursor: "default" });
				}
			}
		},
		'mouse:out': function(e){
			if(tempPoint)
			{
				canvas.remove(tempPoint);
				tempPoint = null;
				LineHovered = null;
			}
		}
		,
		'mouse:up': function (o) {
			loadDataToTable();
			panning = false;
			isDrawing = false;
			isMouseDown = false;
		},
		'object:moving': function(e) {
			var p = e.target;
			var pointer = canvas.getPointer(e.e);
			var currentObj;
			var allObject = canvas.getObjects();
			if (p.name.split('-')[0] === "i") {
				for (var i = 0; i < Shapes.length; i++) {
					if (p.parent === Shapes[i].name) {
						currentObj = Shapes[i];
						Shapes[i].Move({offsetX:e.e.movementX, offsetY: e.e.movementY});
						break;
					}
				}
			} 
			else {
				for (var i = 0; i < Shapes.length; i++) {
					if (p.parent === Shapes[i].name) {
						Shapes[i].Move({point: p});
						break;
					}
				}
			}
			canvas.renderAll();
		}

	});
	if (canvas.width != $("#wrapper").width()) {
		var scaleMultiplier = $("#wrapper").width() / canvas.width;
		var objects = canvas.getObjects();

		canvas.setWidth(canvas.getWidth() * scaleMultiplier);
		canvas.setHeight(canvas.getHeight() * scaleMultiplier);
		canvas.renderAll();
		canvas.calcOffset();
	}
	$(window).resize(function (){
		if (canvas.width != $("#wrapper").width()) {
			var scaleMultiplier = $("#wrapper").width() / canvas.width;
			var objects = canvas.getObjects();

			canvas.setWidth(canvas.getWidth() * scaleMultiplier);
			canvas.setHeight(canvas.getHeight() * scaleMultiplier);
			canvas.renderAll();
			canvas.calcOffset();
		}
	});

	$('.tblShape').on("blur","tr",function(e){
		var allObject = canvas.getObjects();
		for (var i = 0; i < allObject.length; i++) {
			if (allObject[i].get('type') === "circle") {
				allObject[i].set({ strokeWidth: 1 });
			}
		}
	});

	$('.tblShape').on('click', 'span', function (e) {
		var name = this.parentElement.parentElement.cells[0].firstChild.value;
		console.log(name);
		for (var i = 0; i < Shapes.length; i++) {
			if (Shapes[i].name == name){
				Shapes[i].Remove();
				Shapes.splice(Shapes.indexOf(Shapes[i]), 1);
				$(this).parents('tr').detach();		
				break;
			}
		}
	});
});
function loadBackground(url){
	url = $('#txtImgUrl').val();
	if(url){
		$('#myModal').modal('hide');
		$('#modalError').text("");
		var bgImg = canvas.getItem('background', null);
		canvas.remove(bgImg);
		fabric.Image.fromURL(url, function (img) {
			img.selectable = false;
			img.set({name: 'background', left: 0, top: 0});
			imgHeight = img.height;
			imgWidth = img.width;
			canvas.add(img);
			canvas.sendToBack(img);
			canvas.setZoom(0.7);
			canvas.renderAll();
           //canvas.controlsAboveOverlay = true;
       });
	}else{
		$('#myModal').modal('show');
		$('#modalError').text("");
		$('#modalError').text("Image url cannot be empty. Please enter your image url!");
	}
}
function initCanvas(){
	canvas = new fabric.Canvas('canvas', {
		selection: false,allowTouchScrolling:true,controlsAboveOverlay:false
	});
	fabric.Circle.prototype.originX = fabric.Circle.prototype.originY = 'center';
	fabric.Line.prototype.originX = fabric.Line.prototype.originY = 'center';
	loadBackground();
}
function randomName(type) {
	var lstName = [];
	var name;
	var isExsit = true;
	var i = 1;
	var index = 1;
	Shapes.forEach(function (o) {
		index++;
		if (o.type == type)
			lstName.push(o.name);
	});

	while (isExsit) {
		if (type === 'line')
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
}
function loadDataToTable() {
	var context = "";
	parentElement = null;
	for (var i = 0; i < Shapes.length; i++) {
		context += '<tr><td><i class="showDetail fa fa-plus" style="font-size:10pt" onclick="ShowShapeDetail(this,event);"></i></td><td><input id="name" size="5" type="text" style="border:none" onclick="onInputClicked(this);" onkeypress="return ValidateKey();" onchange="textChange(this,this.value);" value="' + Shapes[i].name
		+'" /></td><td>'+Shapes[i].type+'</td><td style="width:50px">';
		if (Shapes[i].AddPointMode){
			context +='<label class="switch" data-toggle="tooltip" data-delay="0" data-placement="left" title="click on canvas where you want to add point!"><input id="switchAddPoint" onchange="onChangeAddPoint(this);" type="checkbox" checked><span class="slider round"></span></label>';
		}else{
			context +='<label class="switch" data-toggle="tooltip" data-delay="0" data-placement="left" title="click on canvas where you want to add point!"><input id="switchAddPoint" onchange="onChangeAddPoint(this);" type="checkbox" ><span class="slider round"></span></label>';
		}
		context += '</td><td><span class="table-remove fa fa-trash-o" onclick="onRemoveShapeClicked(this);"></span></td></tr>' +
		'<tr hidden="true" ><td colspan="4"><table style="background-color:#fff" class="tblShapeDetail table table-bordered"><thead><tr><td><b>Point</b></td><td><b>X</b></td><td><b>Y</b></td><td>#</td></tr></thead><tbody>';
		Shapes[i].points.forEach(function(p){
			var x = Math.round((p.top / imgHeight)* 100);
			var y = Math.round((p.left / imgWidth)* 100);
			context += '<tr onclick="showPointDetail(this);"><td hidden="true">'+Shapes[i].name+'</td><td>'+p.name+'</td><td>'+ x +'</td><td>'+ y +'</td><td><span class="point-remove fa fa-eraser" onclick="onPointRemoveClick(this);"></span></td></tr>';
		});
		context += '</tbody></table></td></tr>';
	}
	$('#table tr').not(function(){ return !!$(this).has('th').length; }).remove();

	$('#table tr:last').after(context);
}
function ValidateKey(){
	var key=window.event.keyCode;
	var allowed='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-.0123456789';
	return allowed.indexOf(String.fromCharCode(key)) !=-1 ;
}
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
	var allObject = canvas.getObjects();
	for (var i = 0; i < allObject.length; i++) {
		if (allObject[i].get('type') === "circle") {
			allObject[i].set({ radius: 5 });
		}
	}
	var point = canvas.getItem(pname, name);
	point.set({radius: 15});
	canvas.renderAll();
}
function onInputClicked(e){
	var name = e.value;
	var points = [];
	var allObject = canvas.getObjects();
	for (var i = 0; i < allObject.length; i++) {
		if (allObject[i].get('type') === "circle") {
			allObject[i].set({ radius: 5 });
		}
	}
	for (var i = 0; i < Shapes.length; i++) {
		if (Shapes[i].name === name) {
			for (var j = 0; j < Shapes[i].points.length; j++) {
				Shapes[i].points[j].HidePointLabel();
				var p = canvas.getItem(Shapes[i].points[j].name, Shapes[i].name);
				p && points.push(p);
			}
			break;
		}
	}
	if (points.length > 0) {
		for (var i = 0; i < points.length; i++) {
			points[i].set({radius: 15});
		}
		canvas.renderAll();
	}
}

function show(element, event){
	element.firstChild.hidden = false;
	element.lastChild.hidden = false;
}
function hide(element, event){
	element.firstChild.hidden = true;
	element.lastChild.hidden = true;
}
function onChangeAddPoint(e) {
	var name = e.parentElement.parentElement.parentElement.cells[1].firstChild.value;
	if(e.checked)
	{
		for(var i=0; i < Shapes.length; i++){
			if(Shapes[i].name === name){
				AddPointMode = true;
				currentObj = Shapes[i];
				Shapes[i].AddPointMode = true;
			}else{
				Shapes[i].AddPointMode = false;
			}
		}
		loadDataToTable();
		$('.lblNote').text("Click on canvas where you want to add point!");
	}else{
		AddPointMode =false;
		$('.lblNote').text("");
		for(var i=0; i < Shapes.length; i++){
			if (Shapes[i].name === name){
				Shapes[i].AddPointMode = false;
			}
		}
	}
}
function onPointRemoveClick(e){
	var parent = e.parentElement.parentElement.cells[0].innerText;
	var name = e.parentElement.parentElement.cells[1].innerText;
	for (var i = 0; i < Shapes.length; i++) {
		if (Shapes[i].name === parent) {
			Shapes[i].RemovePoint(name);
		}
	}
	loadDataToTable();
}

function onRemoveShapeClicked(e){
	var name = e.parentElement.parentElement.cells[1].firstChild.value;
	Shapes.forEach(function(s){
		if(s.name === name){
			s.Remove();
			Shapes.splice(Shapes.indexOf(s), 1);
			loadDataToTable();
		}	
	});}
	function textChange(element, newValue) {
		var oldvalue = element.defaultValue;
		var isExsit = false;
		if (newValue !== oldvalue) {
			for (var i = 0; i < Shapes.length; i++) {
				if(Shapes[i].name === newValue){
					isExsit = true;
					break;
				}
			}
			if(!isExsit){
				for (var i=0; i < Shapes.length; i++){
					if (Shapes[i].name === oldvalue) {
						var newShape = Shapes[i].Rename(newValue);
						Shapes.splice(Shapes.indexOf(Shapes[i]), 1);
						Shapes.push(newShape);
						element.defaultValue = newValue;
						canvas.renderAll();
						break;
					}
				}
			}
			else{
				alert("Name already exsit !");
				element.value = oldvalue;
			}
		}
		console.log(newValue);
	}