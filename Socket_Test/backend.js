var fs = require('fs');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('message', (msg) => {
        console.log('message: '+msg);
        fotos= JSON.parse(msg);
        labelData();
    });
});

server.listen(8080, () => {
    console.log("listening on 8080");
});

var SerialPort = require('serialport');
var readline = require('@serialport/parser-readline');
var serial = SerialPort.serialPort;
var com = new SerialPort("com3",{baudRate:115200});

com.on("open",open);

function open(){
    console.log("com is connected!!!");    
}

var parser = com.pipe(new readline({delimiter:'\r\n'}));
parser.on("data",getData);

var counter = 0;
var results = [];
var fotos;

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
}
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