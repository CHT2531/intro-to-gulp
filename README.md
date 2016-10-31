#Intro to Gulp
The following instructions provide an introduction to the Gulp task runner. The completed project can be found in the *text-gulp* folder. 

First we need to install gulp. Open a node.js Command Prompt and enter the following:
```
npm install gulp -g
```
Navigate to the directory where you want to set up a gulp project. Then make a new directory e.g.
```
mkdir test-gulp
```
Change to this directory
```
cd test-gulp
```
Create a new Node.js project
```
npm init
```
Next we will also install gulp as dependency of the project
```
npm install gulp --save-dev
```
Now we are ready to start

##Project Structure
A typical front-end development project has a structure similar to the following:
<pre>
/project/
    ¦-- node_modules/
    ¦-- app
        ¦--imgs/
        ¦--css/
        ¦--less/
        ¦--html/
        ¦--index.html
    ¦-- dist
        ¦--imgs/
        ¦--css/
        ¦--html/
        ¦--index.html
    ¦--gulpfile.js
    ¦--package.json

</pre>

We will get gulp to generate some of this for us. But to get started:
* Inside *test-gulp*
  * Create an *app* folder
* Inside app 
  * Create *less*, *css* and *html* folders
* Create an *index.html* page and save it in the root of the *app* folder e.g.
```html
<!DOCTYPE html>
<html>
<head>
    <title>Intro to Gulp</title>
    <link href="css/style.css" rel="stylesheet" type="text/css">
</head>
<body>
<h1>Gulp Test</h1>
<p>This is a simple for testing Gulp</p>
<form>
<label for="txt">Enter some text: </label><input type="text" id="txt">
</form>
</body>
</html>

```
Inside the *less* folder create a simple less file, *style.less*.
```less
@heading-color:#ACB8BF;
@main-font-color:#DAE9F2;
@bg-color:#456073;

body{
    color:@main-font-color;
    background:@bg-color;
}

h1{
    color:@heading-color;
}
```

Don't worry about compiling it into css we'll get Gulp to do it for us.

##Using Gulp
Gulp tasks are written using JavaScript.
* Create a new JavaScript file save it as *gulpfile.js*.

Add the following code:
```
var gulp = require('gulp');
gulp.task('hello-world', function() {
  console.log("Hello from Gulp");
});
```
* Save the file
* In the Command prompt enter the following:

```
gulp hello-world
```

You should get a console message saying 'Hello from Gulp'. Gulp task always have the same structure:
```
gulp.task('name-of-task',function(){
    //do stuff
})
```

##Using Gulp with Less
Now let's do something useful with Gulp. We will get Gulp to compile some Less code for us
* First we need the *gulp-less* plug-in. 
* In the Command Prompt enter

```
npm install gulp-less --save-dev
```

Now change your *gulpfile.js* to the following

```javascript
var gulp = require('gulp');
var less = require('gulp-less');
gulp.task('less', function(){
  return gulp.src('app/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('app/css'))
});
```

Gulp tasks are often structured in the same way
* we specify a source file (in this case *app/less/style.less*)
* we process this file in some way (in this case using *gulp-less*)
* we specify a destination for the output (in this case *app/css*)

In the command prompt enter the following
```
gulp less
```
* You should get some output confirming you have run the less plug-in.
* Check to see that a *css* folder has been generated for you
* Refresh your page in a browser, the page should now be styled. 

##Browser testing with Browsersync

We need to install the Browsersync plug-in
```
npm install browser-sync --save-dev
```

Modify your gulpfile.js to add a new task for Browsersync

```javascript
var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();

gulp.task('less', function(){
  return gulp.src('app/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('app/css'))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    browser:["iexplore", "chrome"]
  })
})
```
* Save the file.
* In the command prompt enter the following
```
gulp browser-sync
```
A web server will be started and both Internet Explorer and Chrome should open. Type something into the text field, note how this is synchronised across both browsers.

The task looks a little different. All we are doing is specifying options for the Browsersync plug-in:
* *baseDir* - where to start serving pages from
* *browser* - a list of browsers to open the page in


* In the Command Prompt hit *ctrl+c* to stop Browsersync running

##Watch mode
Gulp allows us to watch files, monitor them, and if a change is made run a task automatically. We will set gulp up to watch our *index.html* page. If we make changes to it, it will be reloaded in the browsers automatically. 

* Modify the gulpfile so it looks like the following

```
var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();

gulp.task('less', function(){
  return gulp.src('app/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('app/css'))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    browser:["iexplore", "chrome"]
  })

})


gulp.task('browserSyncReload', function(){
  browserSync.reload();
})

gulp.task('watch',['browserSync'],function(){
    gulp.watch("app/index.html", ['browserSyncReload']);
})
```

Two new tasks have been added *browserSyncReload* and *watch*
* The *browserSyncReload* task simply instructs the browser to reload the page.
* The watch task introduces two new ideas
  * A list of tasks to run before the current task. This is specified using an array of task i.e. *['browserSync']*. We need to start the browsers and webservers for Browsersync before we start watching the files. 
  * The *watch* command *gulp.watch()*. This specifies which file to watch and which task to run when it changes. 

* Test this works (you will have to run the watch task from the Command Prompt).

##Tying the tasks together
It would be nice if we could run a single command that would watch for changes in all the files, compile less code and reload in the browser for us automatically. Try modifying your gulp *watch* task so it looks like the following:

```javascript
gulp.task('watch',['browserSync','less'],function(){
    gulp.watch("app/less/style.less", ['less']);
    gulp.watch("app/css/style.css", ['browserSyncReload']); 
    gulp.watch("app/index.html", ['browserSyncReload']);
})

```

* Run the watch task again. You should find that if you make a change to the html page or to the less file the browser reloads automatically to show changes. 

##Globbing
Globbing allows us to use a pattern to match files so we don't have to list every file individually that we want to watch, for example

```
gulp.watch("app/css/*.css", ['browserSyncReload']); 
```

Specifies Gulp should watch any file with a css extension in the *css* folder. The * is used as a wildcard. Or we could specify:
```
gulp.watch("app/**/*.html", ['browserSyncReload']);
```

This states watch for any files in the *app* folder that end with an HTML extension

* Make these changes to your gulp file. Run the watch task again and test this still works. 

##Generating a production version

The final version of the website that we serve to users will be different from the one we work on during development. Here are some examples

1. No less or sass files in the production copy, only css.
2. Images are optimised in the production copy.
3. CSS, JS and HTML are minified in the production, no need to do this for development.

We can write a gulp task that will generate production version of our application for us. This production version will be output to the *dist* (for distirbution) folder. 

###Moving files
Let's create a gulp task that will move the html files from the *app* folder to the *dist* folder. 
* Add the following gulp task to *gulpfile.js*
```
gulp.task('move-html', function() {
  return gulp.src('app/**/*.html')
  .pipe(gulp.dest('dist'))
})
```

This simple selects all the html files in the *app* folder and moves them into the *dist* folder. 
* Check this works (note the folder structure in *dist* mirrors the structure in *app* ). 

###Minifying CSS
Another common task is to minimise the CSS. We will use a plug-in *gulp-cssnano* to do this. In the Command Prompt:
```
npm install gulp-cssnano --save-dev
```
* Add a require statement to import the *gulp-cssnano* plugin near the top of the gulpfile i.e.
```
var cssnano = require('gulp-cssnano');
```

* Then add another gulp task

```
gulp.task('minify-css', function() {
    return gulp.src('app/css/style.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css/'));
});
```

* Test this works. You should find a minified version of the css in the *dist* folder after running the task. 

###Combining the two build tasks

Finally we will create a build task that will run both *minify-css* and *move-html*. Add the following gulp task:

```
gulp.task('build',['move-html','minify-css'], function() {
    console.log("Build complete")
});
```

* Again test this works

##Learning More
The above is a fairly brief overview. There are lots more gulp plug-ins for tasks such as 
* Minimising JavaScript
* Auto-prefixing. Automatically adding browser prefixes to css properties. 
* Compressing images

There are lots of tutorials online e.g.
* https://css-tricks.com/gulp-for-beginners/ 
* https://github.com/gulpjs/gulp/blob/master/docs/README.md#articles 