
var fs = require('fs');
var path = require('path');
var parser = require('./parser.js');
var input = process.argv[2];
var cleanData;









//the actual processesor ---------------------------------------------------------------------

  fs.readFile(input,function(err,data){

    if(path.extname(input) ==".cl2") { //prevents proccessing of other file types

    cleanData = JSON.stringify(parser.parse(data)); //runs data through parser
      fs.writeFile('swimMeetNewestfile.json',cleanData,function(err) {
        if(err) throw err;
        console.log("it's saved")
      });

    } else{console.error("wrong file type: " + path.extname(input));}

  });
