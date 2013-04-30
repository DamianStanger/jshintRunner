(function(){
  "use strict";

  var fs = require("fs"),
    path = require("path"),
    jshint = require("jshint").JSHINT;

  function getCommandArguments() {
    var args = process.argv;
    args.shift();
    args.shift();

    console.log("Running JsHint on all the *.js files in the following:");
    console.log(args);
    console.log();
    return args;
  }

  function processFile(file, config) {
    if (/\.(js|json|jshintrc)$/.test(file)) {
      var fileContents = fs.readFileSync(file, 'utf8');
      var success = jshint(fileContents, config);
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

  function iterateDir(file, config) {
    var stat,
      directoryHintStat,
      hintStat,
      hintStats = [];

    try{
      stat = fs.statSync(file);
    }
    catch(e){
      console.log(e);
      return hintStats;
    }

    if(stat.isDirectory()) {
      var files = fs.readdirSync(file);
      files.forEach(function(nestedfile) {
        directoryHintStat = iterateDir(path.join(file, nestedfile), config);
        hintStats = hintStats.concat(directoryHintStat);
      });
    } else {
      hintStat = processFile(file, config);
      if(hintStat){
        hintStats.push(hintStat);
      }
    }
    return hintStats;
  }

  function getParentDirectory(resolvedDirectory) {
    return path.join(resolvedDirectory + "\\..");
  }

  function getJshintConfig(directory) {
    var config,
      resolvedDirectory,
      dirContents,
      dirStats = fs.statSync(directory);

    if(!dirStats.isDirectory()){
      return getJshintConfig(path.dirname(directory));
    }

    dirContents = fs.readdirSync(directory);

    dirContents.forEach(function(file) {
      if(file === '.jshintrc') {
        var fullPath = path.join(directory, file);
        var jsonString = fs.readFileSync(fullPath, 'utf8');
        try {
          //console.log("getting config from " + fullPath);
          config = JSON.parse(jsonString);
        }
        catch(e) {
          config = undefined;
          console.log("\n*** .jshint file must be valid JSON keys and values must be strings (enclosed in quotes) - processing file: " + fullPath + "\n");
        }
      }
    });

    if(config){ return config;}

    resolvedDirectory = path.resolve(directory);
    if(directory === resolvedDirectory) {
      return {};
    }

    return getJshintConfig(getParentDirectory(resolvedDirectory));
  }

  function run() {
    var allHintStats = [],
      args = getCommandArguments();

    args.forEach(function (file) {
      var config = getJshintConfig(file);
      //console.log(config);
      //console.log();
      allHintStats = allHintStats.concat(iterateDir(file, config));
    });

    var failedHints = allHintStats.filter(function (x) {
      return !x.success;
    });

    console.log();
    console.log(failedHints.length + " of " + allHintStats.length + " files failed jshint");
    console.log();

    failedHints.forEach(function (hint) {
      console.log("++++ " + hint.file + " ++++");
      console.log(hint.errors);
      console.log();
    });
  }


run();

})();