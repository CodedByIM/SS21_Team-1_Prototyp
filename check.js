const fs = require('fs');
var results = { table: [] };
fs.readFile('data2.txt', 'utf8', (err, data)=>{
    results.table.push(JSON.parse(data));
    console.log(results, results.table.length);
    if(err) return console.log(err);
  })