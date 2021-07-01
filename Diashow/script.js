var fotos = [
    {source: "images/amusement/amusement_0487.jpg", starttime:"", endtime:"", emotion:"happy"},
    {source: "images/amusement/amusement_0488.jpg", starttime:"", endtime:"", emotion:"happy"},
    {source: "images/amusement/amusement_0489.jpg", starttime:"", endtime:"", emotion:"happy"},
];
var index = 0;
var date;
date= new Date();
fotos[index].starttime = date.toUTCString();

document.getElementById("button").addEventListener("click", function(){
    date= new Date;
    index=index+1;
    fotos[index-1].endtime = date.toUTCString();    
    fotos[index].starttime = date.toUTCString();
    document.getElementById("foto").src = fotos[index].source;
    console.log(fotos[index]);
    console.log(fotos);
})

/*
for loop

foto[i]

for loop 

resulsts[j]
if results [j] < ...

results[j].emotion = ...

"images/amusement/amusement_0487.jpg","images/amusement/amusement_0488.jpg","images/amusement/amusement_0489.jpg"
*/