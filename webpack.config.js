const { resolve, join } = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var NODE_ENV = process.env.NODE_ENV || 'development',
assetsPath = __dirname + '/src',
publicPath = __dirname + '/public',
isDev = (NODE_ENV === 'development' || NODE_ENV === 'development-build');

module.exports = {
	context: assetsPath,

	entry: {
		index: 'index.js'
	},

	output: {
		path: publicPath,
		publicPath: '/',
		filename: '[name].js'
	},

	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: isDev ? 'development' : 'production'
		}),
	],

	resolve: {
		extensions: ['.js', '.json'],
		modules: [
			resolve(__dirname, 'src/'),
			"node_modules"
		]
	},

	resolveLoader: {
		modules: ["node_modules"]
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [
					assetsPath
				]
			}
		]
	},

	watch: isDev,

	watchOptions: {
		aggreagteTimeout: 100
	},

	devtool: isDev ? 'inline-source-map' : false
}

if(NODE_ENV === 'production') {

	module.exports.plugins.push(
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),

		new UglifyJSPlugin({
			compress: {
				screw_ie8: true,
				dead_code: true,
				warnings: false,
				drop_console: true,
				unsafe: true,
				sequences : true,
				booleans : true,
				loops : true,
				unused: true
			},
			mangle: {
				screw_ie8: true,
				keep_fnames: true
			},
			comments: false,
			beautify: false,
		})
	);

}
