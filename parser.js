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

function setUniversalValues(array) {
  for(var i = 0; i < array.length;i++) {
      array[i].team = array[1].lastName;
      array[i].date = array[0].entryTime.substr(0,8);
      array[i].meet = array[0].lastName + " " + array[0].firstName + " " + array[0].gender;
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


    if(array[14].length !== 2)  {
      array.splice(14,0,"extra");
    }

  return array;

}


//Assignes the correct clean values based on determined criteria
function assignKeys(object) {

  //gathers values from header object and assigns all objects


  //detrmines the gender based on the dirty value in the gender spot
    if(isEven(object.event )) {
      object.gender = "Boys";
    } else {
      object.gender = "Girls";
    }

//determines the distance by the value in the distance spot
    if(object["distance"][0] == 2 ) {
      object.distance = '25';
    } else if (object["distance"][0] == 5) {
      object.distance = '50';
    }else {
      object.distance = '100';
    }

//detrmines the stoke type by the value in the stoke spot
    if(object["stroke"][1] == 1) {
      object.stroke = "Freestyle"
    }else if (object["stroke"][1] == 2) {
      object.stroke = "Backstroke"
    }
    else if (object["stroke"][1] == 3) {
      object.stroke = "Breaststroke"
    }
    else if (object["stroke"][1] == 4) {
      object.stroke = "Butterfly"
    }
    else if (object["stroke"][1] == 5) {
      object.stroke = "Individual Medley";
    }

//sets age
    object.age = calcAge(object);

    //determies age group by the value in the age spot
    if (object.age < 7) {
      object.ageGroup = "6 & un";
    }else if(object.age > 6 && object.age < 9 ){
      object.ageGroup = "7-8";
    }else if(object.age  > 8 && object.age < 11) {
      object.ageGroup = "9-10";
    }else if(object.age  > 10 && object.age < 13) {
      object.ageGroup = "11-12";
    }else if(object.age  > 12 && object.age < 15) {
      object.ageGroup = "13-14";
    }else if(object.age  > 14 && object.age < 19) {
      object.ageGroup = "15-18";
    }


    //sets full name
    object.fullName = object.firstName + " " + object.lastName;


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
var headers = ['extraOne','lastName','firstName','gender','age','ageGroup','distance','event','team','entryTime','finalTime','meet','date','ovrallRank','extra3','heatRank','stroke'];





function parse(data) {
  var sdata = data.toString().split("\n"); //splits file into an array of rows

  var ndata = [];

  for(var i = 0; i < sdata.length;i++) {

    var cleanData = removeWhiteSpace(sdata[i]); //removes all the excess white space and seperates every value with a comma

    var readyString = cleanData.split(","); //splits the row into an array of values
    ndata.push(readyString);
  }

  var onlyNeededRows = removeUnRows(ndata,"E","F","Z","A","Z","D3"); //removes the uneeded rows from the file

var objects = [];

for(var i = 0; i < onlyNeededRows.length;i++){
  var object = createObj(fixRowLength(onlyNeededRows[i]),headers);
  if(onlyNeededRows.indexOf(onlyNeededRows[i]) != 0 && onlyNeededRows.indexOf(onlyNeededRows[i]) != 1) { //doesnt change the keys of our first 2 header array index
    assignKeys(object);
    objects.push(object);
  }else {objects.push(object)}

}

setUniversalValues(objects);
objects.shift();//removes now irrelevant header array
objects.shift(); //removes now irrelevant header array

  return objects;

}






module.exports.parse = parse;
