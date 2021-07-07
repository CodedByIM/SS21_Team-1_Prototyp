var fs = require('fs'); 

//express notwendig
const express = require('express');
const path = require('path');

//express notwendig
const app = express();
const port = process.env.PORT || 8080;

//http & scocket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//express serve html page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/Diashow/index.html'));
  });

//express notwendig
app.listen(port);
console.log('Server started at http://localhost/:' + port);

//express pfad
var publicDir = require('path').join(__dirname,'/Diashow'); 
app.use(express.static(publicDir));

//serialport notwendig
var SerialPort = require('serialport');
var readline = require('@serialport/parser-readline');
var serial = SerialPort.serialPort;
var com = new SerialPort("com3",{baudRate:115200});

//serialport notwendig
com.on("open",open);

function open(){
    console.log("com is connected!!!");    
}

//serialport notwendig
var parser = com.pipe(new readline({delimiter:'\r\n'}));
parser.on("data",getData);

var counter = 0;
var results = [];
var fotos;

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      fotos= JSON.parse(msg);
      labelData();
    });
  });

//handles incoming data
function getData(data){
    //converts sensor data to object 
    date= new Date ();
    let resultObject = { Uhrzeit: date.toUTCString(), Herzschlag: data, Sauerstoff: "", Emotion: "" }; 
    results.push(resultObject);
    console.log(resultObject);
    counter= counter+1;
    //saves as JSON
    if (counter== 15){
        counter = 0;
        writeJson();    
    }

    //sensor data labeled with emotions
    function labelData(){
        for(let i = 0; i < fotos.length; i++){
            for(let j = 0; j < results.length; j++){
                if(Date.parse(results[j].Uhrzeit) >= Date.parse(fotos[i].starttime) && Date.parse(results[j].Uhrzeit) <= Date.parse(fotos[i].endtime) ){
                    results[j].emotion = fotos[i].emotion;
                }
            }
      }
    }
    function writeJson(){
        fs.writeFile("./data.json", JSON.stringify(results), 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        
            console.log(results.length, "values are saved");
        });
    }

}