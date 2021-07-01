const fs = require('fs');

var SerialPort = require('serialport');
var readline = require('@serialport/parser-readline');
var serial = SerialPort.serialPort;
var com = new SerialPort("com3",{baudRate:115200});

var results = [];
var jsonResults;
var counter = 0;

var date;
com.on("open",open);




function open(){
  console.log("com is connected!!!");
  
}

var parser = com.pipe(new readline({delimiter:'\r\n'}));

parser.on("data",getData);



function getData(data){ 
  date= new Date ();
  let resultObject = { Uhrzeit: date.toUTCString(), Herzschlag: data, Sauerstoff: "", Emotion: "" }; 
  results.push(resultObject);
  console.log(resultObject);
  counter= counter+1;

  if (counter== 15){
    counter = 0;
    jsonResults = JSON.stringify(results);
    
    fs.writeFile("./data.json", jsonResults, 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }
  
      console.log(results.length, "values are saved");
    });

  }

}
