(function(){
  "use strict";

  var fs = require("fs"),
    path = require("path"),
    jshint = require("jshint").JSHINT,
    Configurator = require("../src/Configurator");

  function getCommandArguments() {
    var args = process.argv;
    args.shift();
    args.shift();

    if(args.length < 1) {
      console.log("Usage: jshintRunner directory1 directory2 ... directory-n file1.js file2.js ... file-n.js");
      return [];
    } else {
      console.log("Running JsHint on all the *.js files in the following:");
      console.log(args);
      console.log();
      return args;
    }
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

  function run() {
    var allHintStats = [],
      args = getCommandArguments(),
      configurator = new Configurator(fs, path);

    args.forEach(function (file) {
      var config = configurator.getJshintConfig(file);
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