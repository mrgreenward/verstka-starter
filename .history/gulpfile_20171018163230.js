'use strict'

var gulp = require('gulp'), // Gulp
debug = require('gulp-debug'), // дебагер для терминала
notify = require("gulp-notify"), // отображение ошибок
plumber = require('gulp-plumber'), // обработка ошибок 
sourcemaps = require('gulp-sourcemaps'),
pug = require('gulp-pug'), 
uglify = require('gulp-uglify'),
prefixer = require('gulp-autoprefixer'),
sass = require('gulp-sass'),
cleanCss = require('gulp-clean-css'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
rimraf = require('rimraf'),
browserSync = require("browser-sync"),
reload = browserSync.reload,
argv = require('yargs').argv, //передача параметров таска из консоли
gulpIfElse = require('gulp-if'); // c помощью него разделяю окружение //.pipe( ifElse(condition, ifCallback, elseCallback) )

var path = {
    dist : {
        html : 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    build:{
        html : 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src:{
        html: 'src/**/*.pug',
        js: '.src/js/',
        scss: 'src/scss/**/*.scss',
        img: 'src/img/',
        fonts: 'src/fonts/',
    },
    watch:{
        html: 'src/*.pug',
        js: '.src/js/',
        scss: 'src/scss/**/*.scss',
        img: 'src/img/',
        fonts: 'src/fonts/',
        
    },
    clean: './build'
}
var config = {
    server: {
        baseDir: path.build},
        host: 'localhost',
        port: 3333,
        ligPrefix: "webbuilder-starter"
}
//clean get gulp clean
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});
//server
gulp.task('webserver',()=>{
    browserSync(config)
})

// pug to html
gulp.task('html:build',()=>{
    gulp.src(path.src.html)
    .pipe(plumber())
    .pipe(debug({title:'pug source'}))
    .pipe(pug({
        pretty: true,
        doctype: 'HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"' 
    }))
    .pipe(debug({title: 'Pug'}))
    .pipe(gulpIfElse(argv.production,
        gulp.dest(path.dist.html),
        //else
        gulp.dest(path.build.html)))
    .pipe(reload({stream: true}));
})
//js
gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(gulpIfElse(argv.dev, sourcemaps.init()))
        .pipe(gulpIfElse(argv.production,uglify()))
        .pipe(gulpIfElse(argv.dev, sourcemaps.write()))
        .pipe(gulpIfElse(argv.production,
            gulp.dest(path.dist.js),
            //else
            gulp.dest(path.build.js)))
        .pipe(reload({stream: true}));
});
//styles
gulp.task('style:build', function () {
    gulp.src(path.src.scss)
        .pipe(gulpIfElse(argv.dev,sourcemaps.init())) //включить мапы только для dev
        .pipe(plumber()) 
        .pipe(debug({title: 'Sass source'})) 
        .pipe(sass())
        .pipe(debug({title: 'Sass'})) 
        .pipe(prefixer())
        .pipe(gulpIfElse(argv.production, cleanCss()))
        .pipe(gulpIfElse(argv.dev,sourcemaps.write())) 
        .pipe(gulpIfElse(argv.production,
            gulp.dest(path.dist.css),
            // else
            gulp.dest(path.build.css)))
        .pipe(debug({title: 'Sass dest'})) 
        .pipe(reload({stream: true}));
});
//images
gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(gulp.dest(path.dist.img))
});
//fonts
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(gulp.dest(path.dist.fonts))
});
// get all
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);
//watch
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});
// default gulp task
gulp.task('default', ['build', 'webserver', 'watch']);