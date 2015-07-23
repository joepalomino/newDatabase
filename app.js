
var fs = require('fs');
var input = process.argv[2];
var currentSeason = 06/01/2015;



//removes exceaa white space between values
function removeWhiteSpace(file){
  file = file.split(/[\s,] + /).join();
  file = file.replace(/[\s,]+/g, ',');
  return file;
}

//determines if even
function isEven(int) {
  if(int % 2 == 0) {return true } else {  return false  }
}

function calcAge(object) {
  if(object.age.length > 8) {
    return object.age.substr(8,2);
  }else {
    return object["ageGroup"][0];
  }
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


//Assignes the correct clean values based on determined criteria
function assignKeys(object) {

  //detrmines the gender based on the dirty value in the gender spot
    if(isEven(object.extra5 )) {
      object.gender = "Boys";
    } else {
      object.gender = "Girls";
    }

//determines the distance by the dirty value in the distance spot
    if(object["distance"][0] == 2 ) {
      object.distance = 25;
    } else if (object["distance"][0] == 5) {
      object.distance = 50;
    }else {
      object.distance = 100;
    }

//detrmines the stoke type by the value in the stoke spot
    if(object["stroke"][1] == 1) {
      object.stroke = "Freesttyle"
    }else if (object["stroke"][1] == 2) {
      object.stroke = "Backstroke"
    }
    else if (object["stroke"][1] == 3) {
      object.stroke = "Breaststoke"
    }
    else if (object["stroke"][1] == 4) {
      object.stroke = "Butterfly"
    }
    else if (object["stroke"][1] == 5) {
      object.stroke = "Individual Medley";
    }


    //determies age group by the value in the age spot
    if (calcAge(object) < 7) {
      object.ageGroup = "6 & un";
    }else if(calcAge(object) > 6 && calcAge(object) < 9 ){
      object.ageGroup = "7-8";
    }else if(calcAge(object)  > 8 && calcAge(object) < 11) {
      object.ageGroup = "9-10";
    }else if(calcAge(object)  > 10 && calcAge(object) < 13) {
      object.ageGroup = "11-12";
    }else if(calcAge(object)  > 12 && calcAge(object) < 15) {
      object.ageGroup = "13-14";
    }else if(calcAge(object)  > 14 && calcAge(object) < 19) {
      object.ageGroup = "15-18";
    }


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


//keys
var headers = ['extraOne','firstName','lastName','gender','age','ageGroup','distance','extra5','team','cTime','oTime','meet','date','extra2','extra3','extra4','stroke'];






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
    assignKeys(object);
    objects.push(object);
  });

  console.log(objects);






});
