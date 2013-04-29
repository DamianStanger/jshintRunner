"use strict";

var fs = require("fs"),
  path = require("path"),
  jshint = require("jshint").JSHINT,
  allHintStats = [];

var args = process.argv;
args.shift();
args.shift();

console.log("Running JsHint on all the *.js files in the following:");
console.log(args);
console.log();

function processFile(file) {
  if (/\.js$/.test(file)) {
    var fileContents = fs.readFileSync(file, 'utf8');
    var options = {node:true}, globals = {"angular":true, "describe":true, "it":true, beforeEach:true, expect:true, inject:true};
    var success = jshint(fileContents, options, globals);
    if(!success){
      process.stdout.write("x");
      var errors = jshint.errors.map(function(error) {
        if(!error){return {"reason" : null, "line": 0, "character" : 0};}
        return {"reason" : error.reason, "line": error.line, "character" : error.character};
      });
      return {"file" : file, "success" : false, "errors" : errors };
    }
    process.stdout.write(".");
    return {"file" : file, "success" : true};
  }
  return null;
}

function iterateDir(file) {
  var stat = fs.statSync(file),
    directoryHintStat,
    hintStat,
    hintStats = [];
  if(stat.isDirectory()) {
    var files = fs.readdirSync(file);
    files.forEach(function(nestedfile) {
      directoryHintStat = iterateDir(path.join(file, nestedfile));
      hintStats = hintStats.concat(directoryHintStat);
    });
  } else {
    hintStat = processFile(file);
    if(hintStat){
      hintStats.push(hintStat);
    }
  }
  return hintStats;
}

args.forEach(function(file) {
  allHintStats = allHintStats.concat(iterateDir(file));
});

var failedHints = allHintStats.filter(function (x) {
  return !x.success;
});

console.log();
console.log(failedHints.length + " of " + allHintStats.length + " files failed jshint");
console.log();

failedHints.forEach(function(hint) {
  console.log("++++ " + hint.file + " ++++");
  console.log(hint.errors);
  console.log();
});

//return 0 or -1 success or fail