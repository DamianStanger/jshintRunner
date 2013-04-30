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

##Configuration
Config is done through the .jshintrc and jshint.json files. jshintRunner will look in the target directory for a config
file, if it cant find one it will progressivly look up the parent directory structure untill it does or it gets to the
root. if no config files are found then it will use {} empty options.

The .jshintrc and jshint.json files must be valid json for the file to get used as config. that means the keys must be
enclosed in quotes and there must be no comments.

If you have specified many different directories to run over each different directory can have its own config file,
if you want them all to use the same put a config file in a common parent directory and no config in the children.
This way the same config will get used for all the folders.