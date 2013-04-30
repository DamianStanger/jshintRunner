#jshintRunner

jshintRunner is a module to recursively run the node module jshint recursively on a number of directories and files.

##Usage and examples

###Option 1
configure and run the batch file in the scripts folder

###Option 2
```node src/jshintRunner.js pathToDirectory```

this will run jshint on all the javascript files in the target directory

```node src\jsHintRunner.js src scripts .jshintrc package.json```

will run jshint on files that are in the folders ['src', 'scripts'] and the explicit files ['.jshintrc', 'package.json']

###Exmple - running jshint on all jshintRunner files (excluding node_modules)
```node src\jsHintRunner.js src scripts .jshintrc package.json bin```

###Exmple - running jshint on all jshintRunner files (including node_modules)
```node src\jsHintRunner.js .```