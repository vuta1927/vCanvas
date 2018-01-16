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
	vCanvas.init();

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
		for (var i = 0; i < vCanvas.Shapes.length; i++) {
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
			context += '<tr><td><i class="showDetail fa fa-plus" style="font-size:10pt" onclick="ShowShapeDetail(this,event);"></i></td><td class="name"><input id="name" onclick="onInputClicked(this);" type="text" size="5" style="border:none" onchange="textChange(this,this.value);" onkeypress="return ValidateKey();" value="' + Shapes[i].name
			+'" /></td><td>'+vCanvas.Shapes[i].type+'</td><td></td><td><span class="table-remove fa fa-trash-o"></span></td></tr>' +
			'<tr hidden="true" ><td colspan="4"><table style="background-color:#fff" class="tblShapeDetail table table-bordered"><thead><tr><td><b>Point</b></td><td><b>X</b></td><td><b>Y</b></td></tr></thead><tbody>';
			vCanvas.Shapes[i].points.forEach(function(p){
				var x = Math.round((p.left /vCanvas.background.width)* 100);
				var y = Math.round((p.top / vCanvas.background.height)* 100);
				context += '<tr onclick="showPointDetail(this);"><td hidden="true">'+vCanvas.Shapes[i].name+'</td><td>'+p.name+'</td><td>'+ x +'</td><td>'+ y +'</td></tr>';
			});
			context += '</tbody></table></td></tr>';
		}else{
			context += '<tr><td><i class="showDetail fa fa-plus" style="font-size:10pt" onclick="ShowShapeDetail(this,event);"></i></td><td><input id="name" size="5" type="text" style="border:none" onclick="onInputClicked(this);" onchange="textChange(this,this.value);" onkeypress="return ValidateKey();" value="' + Shapes[i].name
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
				vCanvas.Shapes[i].points[j].HidePointLabel();
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
				AddPointMode = true;
				currentObj = vCanvas.Shapes[i];
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
			var obj = vCanvas.Get(oldvalue);
			if (obj) {
				var newShape = obj.Rename(newValue);
				vCanvas.Remove(obj);
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