var gulp          = require("gulp");
var gutil         = require("gulp-util");
var webpack       = require("webpack");
var webpackConfig = require("./webpack.config");

gulp.task("build-dev", ["webpack:build-watch", "static:build-dev"]);

var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;
myDevConfig.watch = true;
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-watch", function() {
	// run webpack
	devCompiler.watch(100, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-watch", err);
	});
});

gulp.task("static:build-dev", function(callback) {
    gulp.src(["./sources/index.html", "./sources/css/**/*.css"])
        .pipe(gulp.dest("./publish/"));
});