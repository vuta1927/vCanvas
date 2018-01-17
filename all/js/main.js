var vCanvas;
$(window).load(function(){
	vCanvas = new vcanvas({parent: 'wrapper', tableParent:'table'});
	vCanvas.init();
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