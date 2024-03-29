const gulp = require("gulp");
const rollup = require("gulp-better-rollup");
const babel = require("rollup-plugin-babel");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
// const uglify = require("rollup-plugin-uglify");
const replace = require("rollup-plugin-replace");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

const env = process.env.NODE_ENV;

gulp.task("babel", () => {
  return gulp
    .src("src/index.js")
    .pipe(sourcemaps.init())
    .pipe(
      rollup(
        {
          plugins: [
            commonjs(),
            resolve(),
            babel({
              runtimeHelpers: true
            }),
            // fix 'process is not defined'
            replace({
              "process.env.NODE_ENV": JSON.stringify(env)
            })
            // uglify.uglify()
          ]
        },
        {
          format: "iife",
          file: `my-module.js`
        }
      )
    )
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist/"));
});

gulp.task("watch", () => {
  gulp.watch("src/**/*", gulp.series(["babel"]));
});

gulp.task("dev", () => {
  browserSync.init({
    files: ["./dist/**/*"],
    logLevel: "debug",
    logPrefix: "insgeek",
    server: {
      /*这里写的是html文件相对于根目录所在的文件夹*/
      baseDir: "./dist"
      /*这里如果不写，默认启动的是index.html，如果是其他名字，需要这里写*/
      // index: "insurance_template_statement.html"
    },
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: true
    },
    browser: "chrome"
  });
});

gulp.task("default", gulp.series(["babel", "watch"]));
