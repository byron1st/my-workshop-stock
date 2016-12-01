const del = require('del')
const gulp = require('gulp')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const sass = require('gulp-sass')
const electronMocha = require('gulp-electron-mocha')

const COMP_DEST = 'compiled'

const jsList = ['src/**/*.js', 'src/**/*.jsx']
const testList = ['test/src/**/*.js']
const sassList = ['src/**/*.scss']
const htmlNmodeList = ['src/**/app.mode.json', 'src/**/*.html']

const PRECOMPILE = ['del:compiled', 'eslint']
const COMPILE = ['compile:src', 'compile:test', 'compile:sass', 'copy:htmlNmode']

gulp.task('eslint', () => {
  return gulp.src(jsList.concat(testList))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('del:compiled', () => {
  return del.sync([COMP_DEST + '/**/*'])
})

gulp.task('compile:src', PRECOMPILE, () => {
  return gulp.src(jsList)
    .pipe(babel({
      'presets': ['es2015', 'react']
    }))
    .pipe(gulp.dest(COMP_DEST + '/src'))
})

gulp.task('compile:test', PRECOMPILE, () => {
  return gulp.src(testList)
    .pipe(babel({
      'presets': ['es2015', 'react']
    }))
    .pipe(gulp.dest(COMP_DEST + '/test'))
})

gulp.task('compile:sass', PRECOMPILE, () => {
  return gulp.src(sassList)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(COMP_DEST + '/src'))
})

gulp.task('copy:htmlNmode', PRECOMPILE, () => {
  return gulp.src(htmlNmodeList)
    .pipe(gulp.dest(COMP_DEST + '/src'))
})

gulp.task('test', COMPILE, () => {
  return gulp.src(COMP_DEST + '/test/test.js', {read: false})
    .pipe(electronMocha.default())
})
