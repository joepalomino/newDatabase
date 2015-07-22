
var fs = require('fs');
var input = process.argv[2];


//removes exceaa white space between values
function removeWhiteSpace(file){
  file = file.split(/[\s,] + /).join();
  file = file.replace(/[\s,]+/g, ',');
  return file;
}


//takes an array an assignes keys to each array index
function createObj (array,keys) {
    var obj = {};
  for(var i = 0; i < array.length; i++) {

    obj[keys[i]] = array[i];
  }
  return obj;
}

//makes every row the same length
function fixRowLength(array) {

    if(array[4].length > 11) {
        array.splice(5,0,'extra');
    }
    if(array[10].length === 1) {
      array.splice(9,0,array[9])
    }

    if(array[14].length !== 2) {
      array.splice(14,0,"extra");
    }

  return array;

}


function(array ) {
    
}





//a function that loops over every index in an array and deletes that index based on chriteria
function removeUnRows(array,deleteChar1,deleteChar2,deleteChar3,deleteChar4,deleteChar5,deleteWord) {
  data = [];
  for(var i = 0; i < array.length; i++) {
    //deletes the unwanted rows
    if(array[i][0][0] === deleteChar1||array[i][0][0] === deleteChar2 ||array[i][0][0] === deleteChar3||array[i][0][0] === deleteChar4||array[i][0][0] === deleteChar5||array[i][0] === deleteWord||array[i][0] === "") {
        array.splice(array.indexOf(array[i]),1);
        //resets the counter so the loop will loop over the same index again but with the new value
        i--
      }else {
        //pushes the array to the array
        data.push(array[i]);
      }

  }
  return data;
}



var headers = ['extraOne','firstName','lastName','gender','age','ageGroup','team','stroke','distance','cTime','oTime','meet','date','extra2','extra3','extra4','extra5'];






fs.readFile(input,function(err,data){
  var sdata = data.toString().split("\n");

  var ndata = [];

  for(var i = 0; i < sdata.length;i++) {

    var cleanData = removeWhiteSpace(sdata[i]);

    var readyString = cleanData.split(",");
    ndata.push(readyString);
  }

  var onlyNeededRows = removeUnRows(ndata,"E","F","Z","A","C","D3");
  //var fixedrowLength = fixRowLength(onlyNeededRows);
var objects = [];
  onlyNeededRows.forEach(function(data) {
    var object = createObj(fixRowLength(data),headers);
    objects.push(object);
  });

  console.log(objects);






});
