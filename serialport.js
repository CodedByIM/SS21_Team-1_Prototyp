const fs = require('fs');

var SerialPort = require('serialport');
var readline = require('@serialport/parser-readline');
var serial = SerialPort.serialPort;
var com = new SerialPort("com3",{baudRate:115200});


var date;
com.on("open",open);



function open(){
  console.log("com is connected!!!");
}

var parser = com.pipe(new readline({delimiter:'\r\n'}));

parser.on("data",getData);


var stream = fs.createWriteStream("data2.txt", {flags:'a'});
function getData(data){ 
  date= new Date ();
  let resultObject = { Uhrzeit: date, Herzschlag: data, Sauerstoff: "", Emotion: "" };
  //Results.push({ Uhrzeit: date, Herzschlag: data, Sauerstoff: "", Emotion: "" });
  //console.log(Results);  
  stream.write(JSON.stringify(resultObject)+"," + "\n");
  console.log(resultObject);
  console.error();
}
