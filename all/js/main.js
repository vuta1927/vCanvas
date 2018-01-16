var vCanvas;
$(window).load(function(){
	vCanvas = new vcanvas({parent: 'wrapper'});
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
		loadDataToTable();
	});

	$('#btnAddVerticalLine').click(function(){
		vCanvas.Add({type:"line"});
		loadDataToTable();
	});

	$('#btnAddHorizontalLine').click(function(){
		vCanvas.Add({type:"line"});
		loadDataToTable();
	});

	$('#btnDrawLine').click(function(){
		vCanvas.isDrawing = true;
	});
	$('#btnExport').click(function(){
		var js = JSON.stringify(vCanvas);
		$("#txtData").val(js);
		console.log(js);
	});
	$('#btnResetZoom').click(function(){
		vCanvas.canvas.viewportTransform = [1,0,0,1,0,0];
		vCanvas.canvas.renderAll();
	})
	$('#btnZoomIn').click(function(){
		vCanvas.canvas.setZoom(canvas.getZoom() * 1.1 ) ;
	})
	$('#btnZoomOut').click(function(){
		vCanvas.canvas.setZoom(canvas.getZoom() / 1.1 ) ;
	})
	$('#btnLoad').click(function(){
	});
	$(vCanvas.canvas.wrapperEl).on('mousewheel', function (e) {
            var delta = e.originalEvent.wheelDelta / 500;
            var pointer = vCanvas.canvas.getPointer(e.e);
            // console.log(e.offsetX, e.offsetY);
            var currentWidth = vCanvas.canvas.getWidth();
            var currentHeight = vCanvas.canvas.getHeight();
            console.log(vCanvas.canvas.getWidth(), vCanvas.canvas.getHeight());
            if (delta > 0 ) {
                vCanvas.canvas.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), vCanvas.canvas.getZoom() * 1.1);
            }
            if (delta < 0 ){
                vCanvas.canvas.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), vCanvas.canvas.getZoom() / 1.1);
            }
            return false;
        });
        if (vCanvas.canvas.width != $("#" + vCanvas.parent).width()) {
            var scaleMultiplier = $("#" + vCanvas.parent).width() / vCanvas.canvas.width;
            var objects = vCanvas.canvas.getObjects();

            vCanvas.canvas.setWidth(vCanvas.canvas.getWidth() * scaleMultiplier);
            vCanvas.canvas.setHeight(vCanvas.canvas.getHeight() * scaleMultiplier);
            vCanvas.canvas.renderAll();
            vCanvas.canvas.calcOffset();
        }
        $(window).resize(function (){
            if (vCanvas.canvas.width != $("#" + vCanvas.parent).width()) {
                var scaleMultiplier = $("#" + vCanvas.parent).width() / vCanvas.canvas.width;
                var objects = vCanvas.canvas.getObjects();

                vCanvas.canvas.setWidth(vCanvas.canvas.getWidth() * scaleMultiplier);
                vCanvas.canvas.setHeight(vCanvas.canvas.getHeight() * scaleMultiplier);
                vCanvas.canvas.renderAll();
                vCanvas.canvas.calcOffset();
            }
        });
        vCanvas.canvas.on({
            'mouse:down': function (o) {
                var pointer = vCanvas.canvas.getPointer(o.e);
                x0 = pointer.x;
                y0 = pointer.y;
                if (o.e.type == "touchstart"){
                    startX = o.e.touches[0].pageX;
                    startY = o.e.touches[0].pageY;  
                }

                if((o.e.type === 'touchmove') && (o.e.touches.length > 1)) { return; }
                if (vCanvas.isDrawing) {
                    vCanvas.canvas.defaultCursor = "pointer";
                    vCanvas.isMouseDown = true;
                    var pointer = vCanvas.canvas.getPointer(o.e);
                    var result = randomName("line");

                    var A = new Point({index: 0, name:"P-1", parent:result.name, left:pointer.x, top:pointer.y});
                    var B = new Point({index: 1, name:"P-2", parent:result.name, left:pointer.x, top:pointer.y});
                    var line = new Shape({name:result.name, index: result.index, type:"line", points:[A, B]});
                    line.Draw();
                    vCanvas.ActiveObject = line;
                } else if (vCanvas.AddPointMode){
                    var newPoint = new Point({left:x0, top:y0});
                    vCanvas.ActiveObject.AddPoint(newPoint);
                }else {
                    var obj = o.target;
                    if (!obj || obj.get('type') === "image") {
                        vCanvas.panning = true;
                    // canvas.defaultCursor = "all-scroll";
                    var allObject = vCanvas.canvas.getObjects();
                    for (var i = 0; i < allObject.length; i++) {
                        if (allObject[i].get('type') === "circle") {
                            allObject[i].set({ radius: 5 });
                        }
                    }
                }
            }
        },
        'mouse:move': function (o) {
            if (vCanvas.isMouseDown && vCanvas.isDrawing) {
                var pointer = vCanvas.canvas.getPointer(o.e);
                vCanvas.ActiveObject.Remove();
                for (var i = 0; i < vCanvas.ActiveObject.points.length; i++) {
                    if (vCanvas.ActiveObject.points[i].name === "P-2"){
                        vCanvas.ActiveObject.points[i].left = pointer.x;
                        vCanvas.ActiveObject.points[i].top = pointer.y;
                    }
                }
                vCanvas.ActiveObject.Draw();
                //line.set({ x2: pointer.x, y2: pointer.y });
                vCanvas.canvas.renderAll();
            }
            if (vCanvas.panning && o && o.e) {
                if (o.e.type !== "touchmove"){
                    var delta = new fabric.Point(o.e.movementX, o.e.movementY);
                    vCanvas.canvas.relativePan(delta);
                }else{
                    var delta = new fabric.Point((o.e.touches[0].pageX - startX)/10, (o.e.touches[0].pageY - startY)/10);
                    vCanvas.canvas.relativePan(delta);
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
            if(vCanvas.tempPoint)
            {
                vCanvas.canvas.remove(vCanvas.tempPoint);
                vCanvas.tempPoint = null;
                vCanvas.LineHovered = null;
            }
        }
        ,
        'mouse:up': function (o) {
            if (vCanvas.isDrawing) {
                vCanvas.ActiveObject.Remove();
                vCanvas.ActiveObject.Draw();
                vCanvas.Shapes.push(vCanvas.ActiveObject);
                vCanvas.canvas.renderAll();
            }
            if(vCanvas.ActiveObject){
                vCanvas.ActiveObject.isMoving = false;
            }
            loadDataToTable();
            vCanvas.panning = false;
            vCanvas.isDrawing = false;
            vCanvas.isMouseDown = false;
        },
        'object:moving': function(e) {
            var p = e.target;
            var pointer = vCanvas.canvas.getPointer(e.e);
            var allObject = vCanvas.canvas.getObjects();
            if (p.name.split('-')[0] === "i") {
                for (var i = 0; i < vCanvas.Shapes.length; i++) {
                    if (p.parent === vCanvas.Shapes[i].name) {
                        vCanvas.ActiveObject = vCanvas.Shapes[i];
                        vCanvas.Shapes[i].Move({offsetX:e.e.movementX, offsetY: e.e.movementY});
                        break;
                    }
                }
            } 
            else {
                for (var i = 0; i < vCanvas.Shapes.length; i++) {
                    if (p.parent === vCanvas.Shapes[i].name) {
                        vCanvas.Shapes[i].Move({point: p});
                        break;
                    }
                }
            }
            vCanvas.canvas.renderAll();
        }});
	$('.tblShape').on("blur","tr",function(e){
		var allObject = vCanvas.canvas.getObjects();
		for (var i = 0; i < allObject.length; i++) {
			if (allObject[i].get('type') === "circle") {
				allObject[i].set({ strokeWidth: 1 });
			}
		}
	});

	$('.tblShape').on('click', 'span', function (e) {
		var name = this.parentElement.parentElement.parentElement.cells[0].firstChild.value;
		console.log(name);
		for (var i = 0; i < vCanvas.length; i++) {
			if (vCanvas.Shapes[i].name == name){
				vCanvas.Shapes[i].Remove();
				vCanvas.Shapes.splice(Shapes.indexOf(vCanvas.Shapes[i]), 1);
				$(this).parents('tr').detach();		
				break;
			}
		}
	});
});

function loadDataToTable() {
	var context = "";
	parentElement = null;
	for (var i = 0; i < vCanvas.Shapes.length; i++) {
		if (vCanvas.Shapes[i].type == "line")
		{
			context += '<tr><td><i class="showDetail fa fa-plus" style="font-size:10pt" onclick="ShowShapeDetail(this,event);"></i></td><td class="name"><input id="name" onclick="onInputClicked(this);" type="text" size="5" style="border:none" onchange="textChange(this,this.value);" onkeypress="return ValidateKey();" value="' + vCanvas.Shapes[i].name
			+'" /></td><td>'+vCanvas.Shapes[i].type+'</td><td></td><td><span class="table-remove fa fa-trash-o"></span></td></tr>' +
			'<tr hidden="true" ><td colspan="4"><table style="background-color:#fff" class="tblShapeDetail table table-bordered"><thead><tr><td><b>Point</b></td><td><b>X</b></td><td><b>Y</b></td></tr></thead><tbody>';
			vCanvas.Shapes[i].points.forEach(function(p){
				var x = Math.round((p.left /vCanvas.background.width)* 100);
				var y = Math.round((p.top / vCanvas.background.height)* 100);
				context += '<tr onclick="showPointDetail(this);"><td hidden="true">'+vCanvas.Shapes[i].name+'</td><td>'+p.name+'</td><td>'+ x +'</td><td>'+ y +'</td></tr>';
			});
			context += '</tbody></table></td></tr>';
		}else{
			context += '<tr><td><i class="showDetail fa fa-plus" style="font-size:10pt" onclick="ShowShapeDetail(this,event);"></i></td><td><input id="name" size="5" type="text" style="border:none" onclick="onInputClicked(this);" onchange="textChange(this,this.value);" onkeypress="return ValidateKey();" value="' + vCanvas.Shapes[i].name
			+'" /></td><td>'+vCanvas.Shapes[i].type+'</td><td style="width:50px">';
			if (vCanvas.Shapes[i].AddPointMode){
				context +='<label class="switch" data-toggle="tooltip" data-delay="0" data-placement="left" title="click on canvas where you want to add point!"><input id="switchAddPoint" onchange="onChangeAddPoint(this);" type="checkbox" checked><span class="slider round"></span></label>';
			}else{
				context +='<label class="switch" data-toggle="tooltip" data-delay="0" data-placement="left" title="click on canvas where you want to add point!"><input id="switchAddPoint" onchange="onChangeAddPoint(this);" type="checkbox" ><span class="slider round"></span></label>';
			}
			context += '</td><td><span class="table-remove fa fa-trash-o" onclick="onRemoveShapeClicked(this);"></span></td></tr>' +
			'<tr hidden="true" ><td colspan="4"><table style="background-color:#fff" class="tblShapeDetail table table-bordered"><thead><tr><td><b>Point</b></td><td><b>X</b></td><td><b>Y</b></td><td>#</td></tr></thead><tbody>';
			vCanvas.Shapes[i].points.forEach(function(p){
				var x = p.left;//Math.round((p.left /imgWidth)* 100);
				var y = p.top;//Math.round((p.top / imgHeight)* 100);
				context += '<tr onclick="showPointDetail(this);"><td hidden="true">'+vCanvas.Shapes[i].name+'</td><td>'+p.name+'</td><td>'+ x +'</td><td>'+ y +'</td><td><span class="point-remove fa fa-eraser" onclick="onPointRemoveClick(this);"></span></td></tr>';
			});
			context += '</tbody></table></td></tr>';
		}
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
		for(var i=0; i < vCanvas.Shapes.length; i++){
			if(vCanvas.Shapes[i].name === name){
				vCanvas.AddPointMode = true;
				vCanvas.ActiveObject = vCanvas.Shapes[i];
				vCanvas.Shapes[i].AddPointMode = true;
			}else{
				vCanvas.Shapes[i].AddPointMode = false;
			}
		}
		loadDataToTable();
		$('.lblNote').text("Click on canvas where you want to add point!");
	}else{
		AddPointMode =false;
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
	loadDataToTable();
}

function onRemoveShapeClicked(e){
	var name = e.parentElement.parentElement.cells[1].firstChild.value;
	vCanvas.Remove(name);
	loadDataToTable();
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