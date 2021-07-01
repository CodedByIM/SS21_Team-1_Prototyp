const fs = require('fs');

var SerialPort = require('serialport');
var readline = require('@serialport/parser-readline');
var serial = SerialPort.serialPort;
var com = new SerialPort("com3",{baudRate:115200});

var results = [];
var jsonArray = { table: []};
var date;
com.on("open",open);


var stream = fs.createWriteStream("data.json", {flags:'a'});

function open(){
  console.log("com is connected!!!");
  stream.write(JSON.stringify(jsonArray));
}

var parser = com.pipe(new readline({delimiter:'\r\n'}));

parser.on("data",getData);



function getData(data){ 
  date= new Date ();
  let resultObject = { Uhrzeit: date, Herzschlag: data, Sauerstoff: "", Emotion: "" }; 
  stream.table.push(resultObject);
  console.log(resultObject);
  console.error();
}
