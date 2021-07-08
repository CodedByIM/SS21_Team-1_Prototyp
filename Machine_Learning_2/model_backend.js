const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/model.html");
});

app.use(express.static('Model'));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
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

/**
 * executes when the serialport is opened
 */
 function open(){
    console.log("com is connected!!!");    
}

var parser = com.pipe(new readline({delimiter:'\r\n'}));
parser.on("data",getData);


var parsedData;
var heartrate;
var oxygen;

/**
 * handles incoming data
 * @param {*} data 
 */
function getData(data){
    parsedData = JSON.parse(data);
    heartrate = parsedData.heartrate;
    oxygen = parsedData.oxygen;
    io.emit('message', { heartrate: heartrate, oxygen: oxygen });
    console.log(heartrate, oxygen);
}