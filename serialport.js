
var SerialPort = require('serialport');
var readline = require('@serialport/parser-readline');
var serial = SerialPort.serialPort;
var com = new SerialPort("com3",{baudRate:115200});

var Results = []
var date;
com.on("open",open);

function open(){
  console.log("com is connected!!!");

}

var parser = com.pipe(new readline({delimiter:'\r\n'}));

parser.on("data",getData);

function getData(data){
  date= new Date ();
  //console.log(data, date);
  Results.push({Herzschlag: data, Uhrzeit: date});
  console.log(Results);

}