

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec,child;
//watches the folder
fs.watch("./", {persistent: true},function(event,filename) {
  console.log("event:" + event +"\n" + filename + "\n");
  if(path.extname(filename) == ".cl2") {
    child = exec('node app.js ' + filename,{encoding: 'utf8'}, function(error, stdout,stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr );
      console.log('PATH:' + path.extname(filename));

      if(error !== null) {
        console.log('exec error: ' + error);
      }
    });
  }
});
