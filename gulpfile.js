const del = require('del')
const gulp = require('gulp')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const sass = require('gulp-sass')
const electronMocha = require('gulp-electron-mocha')
const fs = require('fs')

const COMP_DEST = 'compiled'
const PACKAGE_DEST = 'app'

const jsList = ['src/**/*.js', 'src/**/*.jsx']
const testList = ['test/src/**/*.js']
const sassList = ['src/**/*.scss']
const htmlNmodeList = ['src/**/app.mode.json', 'src/**/*.html']
const compiledList = [COMP_DEST + '/src/**/*']

const PRECOMPILE = ['del:compiled', 'eslint']
const COMPILE = ['compile:src', 'compile:test', 'compile:sass', 'copy:htmlNmode']
const PREPACKAGE = ['copy:compiled', 'copy:public']

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

gulp.task('del:package', ['test'], () => {
  return del.sync([PACKAGE_DEST])
})

gulp.task('copy:public', ['copy:semantic', 'copy:bower', 'copy:locales'])

gulp.task('copy:semantic', ['del:package'], () => {
  return gulp.src(['semantic/**/*'])
    .pipe(gulp.dest(PACKAGE_DEST + '/semantic'))
})

gulp.task('copy:bower', ['del:package'], () => {
  return gulp.src(['bower_components/**/*'])
    .pipe(gulp.dest(PACKAGE_DEST + '/bower_components'))
})

gulp.task('copy:locales', ['del:package'], () => {
  return gulp.src(['locales/**/*'])
    .pipe(gulp.dest(PACKAGE_DEST + '/locales'))
})

gulp.task('copy:compiled', ['del:package'], () => {
  return gulp.src(compiledList)
    .pipe(gulp.dest(PACKAGE_DEST + '/dist/src'))
})

gulp.task('package', PREPACKAGE, () => {
  let devPkg = JSON.parse(fs.readFileSync('package.json'))
  let prodPkg = {
    name: devPkg.name,
    version: devPkg.version,
    description: devPkg.description,
    main: 'dist/src/app/main.js',
    author: devPkg.author,
    license: devPkg.license,
    dependencies: devPkg.dependencies
  }
  fs.writeFileSync(PACKAGE_DEST + '/package.json', JSON.stringify(prodPkg))
  fs.writeFileSync(PACKAGE_DEST + '/dist/src/app/app.mode.json', JSON.stringify({ 'mode': 'production' }))
})
