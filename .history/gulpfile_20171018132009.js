'use strict'

var gulp = require('gulp'), // Gulp
debug = require('gulp-debug'), // дебагер для терминала
notify = require("gulp-notify"), // отображение ошибок
plumber = require('gulp-plumber'), // обработка ошибок 
sourcemaps = require('gulp-sourcemaps'),
pug = require('gulp-pug'), 
sass = require('gulp-sass'),
cleanCss = require('gulp-clean-css'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
rimraf = require('rimraf'),
browserSync = require("browser-sync"),
reload = browserSync.reload,
argv = require('yargs').argv, //передача параметров таска из консоли
gulpIfElse = require('gulp-if'); // c помощью него разделяю окружение //.pipe( ifElse(condition, ifCallback, elseCallback) )

var paths = {
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
        css: 'src/scss/**/*.scss',
        img: 'src/img/',
        fonts: 'src/fonts/',
    },
    watch:{
        html: 'src/**/*.pug',
        js: '.src/js/',
        css: 'src/scss/**/*.scss',
        img: 'src/img/',
        fonts: 'src/fonts/',
        
    }
}
var config = {
    server: {
        baseDir: paths.build},
        host: 'localhost',
        port: 3333,
        ligPrefix: "virstka-starter"
}