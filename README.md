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

* `whitespace` (Boolean): Whether or not to preserve whitespace. `false` by default.
* `basePath` (String|Array): The base location to all your templates so that includes/partials can be resolved correctly.
* `defaultExt` (String): The default template extension. Defaults to `.dust`.
* `module` (String): The name of the Dust module to use. Defaults to
`dustjs-linkedin` but can also be `dust` for plain ol' dust, or
`dustjs-helpers` for the LinkedIn Dust build with helpers. If this option is
anything other than the default, make sure you have installed the module via
`npm install`.
* `context` (Object): A JavaScript object to render the template against. This option supports a few different types:

**String**: the location to a file containing valid JSON:

```js
context: "/path/to/file.json"
```

**Object**: a regular ol' JavaScript object:

```js
context: {
  pageTitle: "My Awesome Website"
}
```

**Array**: an array of contexts, either string (files to parse) or JavaScript objects, or both. Each item in the array will be merged into a single context and rendered against the template:
    
```js
context: [
  "path/to/context.json",
  "path/to/another/context.json",
  { more: "data" }
]
```

### FAQ

1. *Why does the output say undefined?*  
Most likely dust is trying to include a file but it can't resove the path properly. Make sure you're setting a `basePath` option.
