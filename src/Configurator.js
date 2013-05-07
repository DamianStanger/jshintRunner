"use strict";

function Configurator(fs, path) {

  this.getParentDirectory = function(resolvedDirectory) {
    return resolvedDirectory + path.sep + "..";
//    console.log("matching on " + resolvedDirectory);
//    var regExp = /^(.*\\)[^\\]$/;
//    var match = regExp.exec(resolvedDirectory);
//    console.log(match);
//    return match[0];

  };

  this.getJshintConfig = function(directory) {
    var config,
      resolvedDirectory,
      resolvedParentDirectory,
      dirContents,
      dirStats,
      exists = fs.existsSync(directory);

    if(!exists){
      return this.getJshintConfig(this.getParentDirectory(directory));
    }

    dirStats = fs.statSync(directory);

    if(!dirStats.isDirectory()){
      return this.getJshintConfig(path.dirname(directory));
    }

//    console.log("isdirectory");

    dirContents = fs.readdirSync(directory);

    dirContents.forEach(function(file) {
      if(file.toLowerCase() === '.jshintrc' || file.toLowerCase() === 'jshint.json') {
        var fullPath = path.join(directory, file);
        var jsonString = fs.readFileSync(fullPath, 'utf8');
        try {
          console.log("getting config from " + fullPath);
          config = JSON.parse(jsonString);
        }
        catch(e) {
          config = undefined;
          console.log("\n*** Error- config file must be valid JSON, keys must be strings (enclosed in quotes), with no comments - whilst processing file: " + fullPath + "\n" + e + "\n\n");
        }
      }
    });

    if(config){
//      console.log("return config");
      return config;}

    resolvedDirectory = path.resolve(directory);
    resolvedParentDirectory = path.resolve(this.getParentDirectory(resolvedDirectory));
//    console.log(resolvedDirectory + " && " + resolvedParentDirectory);
    if(resolvedParentDirectory === resolvedDirectory) {
//      console.log("return {}");
      return {};
    }

//    console.log("return getconfig");
    return this.getJshintConfig(resolvedParentDirectory);
  };
}

module.exports = Configurator;
