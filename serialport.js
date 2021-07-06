

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/Diashow/index.html'));
});

app.listen(port);
console.log('Server started at http://localhost/:' + port);

var publicDir = require('path').join(__dirname,'/Diashow'); 
app.use(express.static(publicDir));



var SerialPort = require('serialport');
var readline = require('@serialport/parser-readline');
var serial = SerialPort.serialPort;
var com = new SerialPort("com3",{baudRate:115200});

var results = {table: []};
var fotos;
var jsonResults;
var counter = 0;

var date;
com.on("open",open);


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function open(){
  console.log("com is connected!!!");
  
}

var parser = com.pipe(new readline({delimiter:'\r\n'}));

parser.on("data",getData);



function getData(data){ 
  date= new Date ();
  let resultObject = { Uhrzeit: date.toUTCString(), Herzschlag: data, Sauerstoff: "", Emotion: "" }; 
  results.table.push(resultObject);
  console.log(resultObject);
  counter= counter+1;


  if(localStorage.getItem('content') != null ){
    let storage = localStorage.getItem('content');
    fotos = JSON.parse(storage);
    labeldata();
    jsonResults = JSON.stringify(results);
    
    

    fs.writeFile("./data.json", jsonResults, 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }
  
      console.log(results.table.length, "values are saved");
    });

  }
  if (counter== 15){
    counter = 0;
    

  }

}

function labelData(){
  for(let i = 0; i < fotos.length; i++){
      for(let j = 0; j < results.length; j++){
          if(Date.parse(results.table[j].Uhrzeit) >= Date.parse(fotos[i].starttime) && Date.parse(results[j].Uhrzeit) <= Date.parse(fotos[i].endtime) ){
              results.table[j].emotion = fotos[i].emotion;
          }
      }
}
}


/*
if( localstorage){
  fotos = JSON parse localstorage
  labeldata();
  json schreiben
}

*/