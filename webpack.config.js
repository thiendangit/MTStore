const path = require('path');
const package = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, options) => {
  const devMode = options.mode === 'development';

  process.env.NODE_ENV = options.mode;

  return {
    entry: path.resolve(__dirname, './src/index.tsx'),
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js',
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      alias: {
        store: path.resolve(__dirname, 'src/store'),
        pages: path.resolve(__dirname, 'src/pages'),
        logic: path.resolve(__dirname, 'src/logic'),
        components: path.resolve(__dirname, 'src/components'),
        constants: path.resolve(__dirname, 'src/constants'),
        hooks: path.resolve(__dirname, 'src/hooks'),
        styles: path.resolve(__dirname, 'src/styles'),
        types: path.resolve(__dirname, 'src/types'),
        utils: path.resolve(__dirname, 'src/utils'),
        contexts: path.resolve(__dirname, 'src/contexts'),
        public: path.resolve(__dirname, 'public'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'babel-loader',
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          include: path.resolve(__dirname, 'src'),
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader', // creates style nodes from JS strings
            {
              loader: 'css-loader', // translates CSS into CommonJS
              options: {
                importLoaders: 1,
              },
            },
            'postcss-loader', // post process the compiled CSS
            'sass-loader', // compiles Sass to CSS, using Node Sass by default
          ],
        },
        { test: /\.(woff|woff2|ttf|eot)$/, loader: 'file-loader' },
        { test: /\.(png|jpg|gif|svg)$/, loader: 'file-loader' },
      ],
    },
    plugins: [
      new Dotenv({
        safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a
        // different file.
        silent: true, // hide components errors
        defaults: false, // load '.env.defaults' as the default values if empty.
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: devMode ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: devMode ? '[name].css' : '[name].[contenthash].css',
      }),
      // copy static files from public folder to build directory
      new CopyPlugin({
        patterns: [
          {
            from: 'public/**/*',
            globOptions: {
              ignore: ['**/index.html'],
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        title: package.name,
        meta: {
          title: package.name,
          description: package.description,
          author: package.author,
          keywords: Array.isArray(package.keywords) ? package.keywords.join(',') : undefined,
          'og:title': package.name,
          'og:description': package.description,
          'og:url': package.homepage,
        },
        minify: {
          html5: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: false,
          removeComments: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributese: true,
          useShortDoctype: true,
        },
      }),
      !devMode ? new CleanWebpackPlugin() : false,
      !devMode ? new BundleAnalyzerPlugin() : false,
    ].filter(Boolean),
    optimization: {
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          // vendor chunk
          vendor: {
            // sync + async chunks
            chunks: 'all',
            name: 'vendor',
            // import file path containing node_modules
            test: /node_modules/,
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          extractComments: true,
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
    },
    devServer: {
      historyApiFallback: {
        disableDotRule: true,
      },
    },
  };
};
