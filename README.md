## About

This task renders Dust templates against a context to produce HTML.

## Getting Started

Install this plugin with the command:

```js
npm install grunt-dust-html
```

Next, add this line to your project's grunt file:

```js
grunt.loadNpmTasks("grunt-dust-html");
```

Lastly, add the configuration settings (see below) to your grunt file.

## Documentation

This task has two required properties, `src` and `dest`. `src` is the path to your source file and `dest` is the file this task will write to (relative to the grunt.js file). If this file already exists **it will be overwritten**.

An example configuration looks like this:

```js
grunt.initConfig({
  dusthtml: {
    dist: {
      src: "src/home.dust",
      dest: "dist/home.html",

      options: {
        // see below for options. this is optional.
      }
    }
  }
});
```

### Optional Configuration Properties

This plugin can be customized by specifying the following options:

* `whitespace`: Whether or not to preserve whitespace. `false` by default.
* `context`: A JavaScript object to render the template against. If this is a string, it is assumed the value is the location to a json file and it will be loaded in.
* `basePath`: The base location to all your templates so that includes/partials can be resolved correctly.

### FAQ

1. *Why does the output say undefined?*  
Most likely dust is trying to include a file but it can't resove the path properly. Make sure you're setting a `basePath` option.
