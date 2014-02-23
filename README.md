# Serval

> A scaffolding tool for your webapp.


## How to install

- Run `npm install`

## API

`serval make`

Create an application based on a generator. You set the name of your app then you choose your generator and it's done.

> Run this command where you want to create the application

`serval generate`

List each options for your current generator. So you can run anything attach to your current generator.

`serval list`

List all the generators.

## Build a Serval generator

You just have to create a `.serval` directory inside your application. Inside of this directory, create an `index.js` with your options.

Ex :

```JavaScript
var fs   = require('fs'),
    path = require('path');
module.exports = function(opt, cmd) {

    /**
     * We will create a new partial from a custom template in your ./gloups directory
     * @param  {Object} data Object from your prompt inquirer or custom object
     * @param  {object} opt  An Helper from gloups
     */
    var build = function(data, opt, cmd) {
        try {
            // Grab the content of your basic partial
            var content = fs.readFileSync(opt.dir + data.generator + path.sep + 'index.html', 'utf8');
            // Write this new partial to your dest folder
            fs.writeFileSync(opt.app + "src" + path.sep + "partials" + path.sep + data.name + '.html', content);
            cmd.success('The view ' + data.name + ' is created');
        }catch(e) {
            cmd.error(e);
        }
    }

    // Launch inquirer, a prompt to retreive some informations
    if(opt.args.length === 1) {
        cmd.inquirer.prompt([
          {
            type : "list",
            name : "generator",
            message : "Choose a generator :",
            choices : ["partial"]
          },
          {
            type : "input",
            name : "name",
            message : "Name of this generator :"
          },
        ], function(answers) {
            build(answers, opt, cmd);
        });
    }

    // Fast method to create a view serval generator [generator]:[name] => serval generator partial:test
    if(opt.args.length > 1 && opt.args[1].split(':').length === 2) {
        build({
            name : opt.args[1].split(':')[1],
            generator : opt.args[1].split(':')[0]
        },opt, cmd);
    }
}
```

These generator can :
- create a new view from a template (*Here from a directory partials inside .serval inside a file named index.html*)

Your generator can create other things. Here it's for a basic HTML application without any JavaScript.

### Helpers

Serval provides some helpers, from the module wrapper :

```JavaScript
module.exports = function(opt, cmd) {
}
```

- **opt** : It's your configuration, it has 3 keys :
    - app : App path
    - args : CLI arguments
    - dir : .serval directory path
- **cmd** : It's Serval's helpers, it provides
    - [beautify](https://www.npmjs.org/package/js-beautify) : clean you indentation inside a JavaScript file
    - [inquirer](https://www.npmjs.org/package/inquirer) : allows you to build a great prompt command (cf exemple)
    - success : Alias of console.log but output is green
    - info : Alias of console.log but output is black|grey
    - error : Alias of console.log but output is red

> *success, info, error* are functions
