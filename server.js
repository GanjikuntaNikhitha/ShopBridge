var express= require("express");
var app = express();
var port =  3002;
app.use(express.static(__dirname + '/src/list'));
app.get('*',function(req,res){
    res.sendFile(__dirname + "/src/list/list.html")
});
app.listen(port,function() {
    console.log("Sever Listening on port" + port)
})