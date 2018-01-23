<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="My_Canvas.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Test canvas</title>
    <link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet" />
    <link href="css/style.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" />
    <script src="js/jquery-3.2.1.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/fabric.js"></script>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" />
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
</head>
<body>
    <div class="container-fluid">
        <div class="row" id="wrapperMain1">
        </div>
        <div class="row" id="wrapperMain0">
        </div>
        <div class="row" id="wrapperMain2">
        </div>
        <div class="row" id="wrapperMain3">
        </div>
        <div class="row" id="wrapperMain4">
        </div>
    </div>
<script type="text/javascript" src="js/myCanvas.js"></script>
<script src="js/sample.js"></script>
<script type="text/javascript">
    var c0 = myCanvas.Create({ parent: "wrapperMain0", types: [types.HLine] });
    c0.on('CanvasModified', function (e) {
        // e.event: name of event
        // e.source
			
        console.log(e.event, c0.ToJson());
    });
    //console.log(c0.id);
    var c1 = myCanvas.Create({ parent: "wrapperMain1", json: sample});
    var c2 = myCanvas.Create({ parent: "wrapperMain2", types: [types.Rect] });
    var c3 = myCanvas.Create({ parent: "wrapperMain3", types: [types.Line] });
    var c4 = myCanvas.Create({ parent: "wrapperMain4", types: [types.HLine, types.VLine] });
    // console.log(c1.ToJson());
</script>
</body>
</html>
