jshintRunner
============

run the node module jshint recursively on a number of directories

##usage
configure and run the batch file in the scripts folder
or
```node src/jshintRunner.js .```

this will run jshint on all the files included in the project (including node_modules)

use 
```node src\jsHintRunner.js src scripts .jshintrc package.json```
to run jshint on only files that are part of this project
