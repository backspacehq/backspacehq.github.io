var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var minifyCss = require('gulp-minify-css');
var request = require('request');
var fs = require('fs');

var slim = require("gulp-slim");



var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});


//Build SLIM files:
gulp.task('slim', function(){
  var postfile= require('./posts.json');
  gulp.src("*.slim")
    .pipe(slim({
      pretty: true,
      data: postfile.payload //Strip payload only
    }))
    .pipe(gulp.dest("./_site/"))
    .pipe(gulp.dest('./'));
    browserSync.reload();
});

//Get medium posts to local file:
gulp.task('getmedium', function(done){
  request('https://medium.com/the-backspace-journal/latest?format=json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //Medium starts its json with garbage, lets start at first '{'
      var json=body.substring(body.indexOf('{'));
      fs.writeFile("./posts.json", json, function(err) {
          if(err) {
            return console.log(err);
          }
          console.log("Posts Saved");
          done();
      });
    }
  })
});

/**
 * Wait for jekyll-build, then launch the Server
 */
// gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
gulp.task('browser-sync', ['sass'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('_scss/main.scss')
        .pipe(sass({
            includePaths: ['sass'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 3 versions', '> 2%', 'ie 9', 'safari 9'], { cascade: true }))
        .pipe(minifyCss())
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(['_scss/*.scss'], ['sass']);
    gulp.watch([
               // '*.html',
               '*.slim',
               // '_layouts/*.html',
               // 'contact/*.html',
               // 'people/*.html',
               // 'portfolio/*.html',
               // 'blog/*.html',
               // '_posts/*',
               '_includes/*.html'
               ],
               // ['jekyll-rebuild', 'slim']);
              ['slim']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'getmedium', 'slim', 'watch']);
