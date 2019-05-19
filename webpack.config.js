const webpack = require('webpack');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const SystemBellPlugin = require('system-bell-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
// const PACKAGE = require('./package.json');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const sourcePath = path.resolve(__dirname, 'src');
const publicPath = path.resolve(__dirname, 'build');
const Settings = require('dotenv');
// load .env settings
Settings.load();

const {
    FIREBASEKEY,
    AUTHDOMAIN,
    DATABASEURL,
    STORAGEBUCKET,
    PROJECTID,
    MESSAGINGSENDERID
} = process.env;

module.exports = function(env, argv) {
    const isProd = argv.mode === 'production';
    const nodeEnv = isProd ? 'production' : 'development';

    return {
        devtool: isProd ? 'hidden-source-map' : 'cheap-module-source-map',
        context: sourcePath,
        entry: {
            js: [
                // react-error-overlay
                !isProd && 'react-dev-utils/webpackHotDevClient',
                // polyfills
                'whatwg-fetch',
                // app entry
                'app.tsx'
            ].filter(Boolean)
        },
        output: {
            path: publicPath,
            filename: '[name].bundle.js',
            devtoolModuleFilenameTemplate: isProd
                ? info => path.relative(sourcePath, info.absoluteResourcePath).replace(/\\/g, '/')
                : info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
        },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'html-loader'
                    }
                },

                // eslint for JS
                {
                    test: /\.(js|jsx)$/,
                    include: sourcePath,
                    enforce: 'pre',
                    use: [
                        {
                            loader: 'eslint-loader',
                            options: { fix: false }
                        }
                    ]
                },

                // tslint + eslint for TS
                {
                    test: /\.(ts|tsx)$/,
                    include: sourcePath,
                    enforce: 'pre',
                    use: [
                        {
                            loader: 'eslint-loader',
                            options: { fix: false }
                        },
                        {
                            loader: 'tslint-loader'
                        },
                        {
                            loader: 'source-map-loader'
                        }
                    ]
                },

                {
                    test: /\.json$/,
                    include: path.resolve(__dirname, 'src/app/assets/animations'),
                    loader: 'json-loader',
                    type: 'javascript/auto'
                },

                {
                    test: /\.(scss|css)$/,
                    use: [
                        isProd && {
                            loader: MiniCssExtractPlugin.loader
                        },
                        !isProd && {
                            loader: 'style-loader',
                            options: {
                                sourceMap: false
                            }
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ].filter(Boolean)
                },

                {
                    test: /\.(t|j)sx?$/,
                    exclude: /node_modules/,
                    include: sourcePath,
                    use: [
                        'cache-loader',
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true
                            }
                        },
                        {
                            loader: 'babel-loader'
                        }
                    ]
                },

                {
                    test: /\.(ttf|eot|svg|woff|woff2)(\?[a-z0-9]+)?$/,
                    include: path.resolve(__dirname, 'src/app/assets/fonts'),
                    loader: 'url-loader'
                },

                {
                    test: /\.(png|jpg)$/,
                    include: path.resolve(__dirname, 'src/app/assets/images'),
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                query: {
                                    name: 'app/assets/images/[name].[ext]'
                                }
                            }
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                query: {
                                    mozjpeg: {
                                        progressive: true
                                    },
                                    gifsicle: {
                                        interlaced: true
                                    },
                                    optipng: {
                                        optimizationLevel: 7
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: [
                '.webpack-loader.js',
                '.web-loader.js',
                '.loader.js',
                '.js',
                '.jsx',
                '.ts',
                '.tsx'
            ],
            modules: [path.resolve(__dirname, 'node_modules'), sourcePath]
        },

        plugins: [
            new webpack.NamedModulesPlugin(),
            // remove moment js locales
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            // analyze bundle sizes with the --debug flag
            argv.debug && new BundleAnalyzerPlugin(),
            // .env variables
            new webpack.DefinePlugin({
                NODE_ENV: JSON.stringify(argv.mode),
                AUTHDOMAIN: JSON.stringify(AUTHDOMAIN),
                DATABASEURL: JSON.stringify(DATABASEURL),
                MESSAGINGSENDERID: JSON.stringify(MESSAGINGSENDERID),
                PROJECTID: JSON.stringify(PROJECTID),
                STORAGEBUCKET: JSON.stringify(STORAGEBUCKET),
                FIREBASEKEY: JSON.stringify(FIREBASEKEY)
            }),
            // generate index.html
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'netlify/index.html'
            }),
            // static assets
            new CopyWebpackPlugin(
                [{ from: 'netlify', ignore: ['*.html'] }, isProd && 'pwa'].filter(Boolean)
            ),
            // DEVELOPMENT
            !isProd &&
                new ForkTsCheckerWebpackPlugin({
                    tslint: path.resolve(__dirname, './tslint.json'),
                    tsconfig: path.resolve(__dirname, './tsconfig.json'),
                    async: false
                }),
            !isProd && new webpack.HotModuleReplacementPlugin(),
            !isProd &&
                new BrowserSyncPlugin(
                    // BrowserSync options
                    {
                        host: 'localhost',
                        port: 8080,
                        open: false,
                        // proxy the Webpack Dev Server endpoint
                        // (which should be serving on http://localhost:8080/)
                        // through BrowserSync
                        proxy: 'http://localhost:8080/',
                        logPrefix: 'Health Dashboard'
                    },
                    // plugin options
                    {
                        reload: false
                    }
                ),
            !isProd && new CaseSensitivePathsPlugin(),
            !isProd && new FriendlyErrorsWebpackPlugin(),
            !isProd && new SystemBellPlugin(),
            !isProd && new ProgressBarPlugin(),
            !isProd && new DuplicatePackageCheckerPlugin(),
            !isProd &&
                new StyleLintPlugin({
                    files: './app/assets/scss/*.scss'
                }),
            // PRODUCTION
            isProd &&
                new ManifestPlugin({
                    fileName: 'asset-manifest.json'
                }),
            isProd &&
                new webpack.LoaderOptionsPlugin({
                    minimize: true,
                    debug: false
                }),
            isProd && new webpack.optimize.AggressiveMergingPlugin(),
            isProd &&
                new webpack.BannerPlugin({
                    banner: 'Doughboy Nutrition Tracker'
                }),
            isProd && new MiniCssExtractPlugin('styles.css'),
            isProd &&
                new GenerateSW({
                    runtimeCaching: [
                        {
                            urlPattern: /images/,
                            handler: 'cacheFirst'
                        },
                        {
                            urlPattern: new RegExp(
                                '^https://fonts.(?:googleapis|gstatic).com/(.*)'
                            ),
                            handler: 'cacheFirst'
                        },
                        {
                            urlPattern: /.*/,
                            handler: 'networkFirst'
                        }
                    ]
                })
        ].filter(Boolean),

        // split out vendor js into its own bundle
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'initial'
                    }
                }
            }
        },

        performance: isProd && {
            maxAssetSize: 600000,
            maxEntrypointSize: 600000,
            hints: 'warning'
        },

        stats: {
            colors: {
                green: '\u001b[32m'
            }
        },

        devServer: {
            contentBase: './src',
            historyApiFallback: true,
            port: 8080,
            compress: isProd,
            inline: !isProd,
            hot: false,
            quiet: true,
            before: function(app) {
                // This lets us open files from the runtime error overlay.
                app.use(errorOverlayMiddleware());
            }
        }
    };
};
