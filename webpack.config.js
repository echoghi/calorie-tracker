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
const SystemBellPlugin = require('system-bell-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const PACKAGE = require('./package.json');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const sourcePath = path.join(__dirname, './src');
const publicPath = path.join(__dirname, './build');

module.exports = function(env) {
    const nodeEnv = env && env.prod ? 'production' : 'development';
    const isProd = nodeEnv === 'production';

    return {
        devtool: isProd ? 'hidden-source-map' : 'cheap-module-source-map',
        context: sourcePath,
        entry: {
            js: [
                // react-error-overlay
                !isProd && 'react-dev-utils/webpackHotDevClient',
                // fetch polyfill
                isProd && 'whatwg-fetch',
                // JS
                'babel-polyfill',
                // app entry
                'app.js'
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

                {
                    test: /\.(js|ts|tsx)$/,
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
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader'
                        }
                    ]
                },

                {
                    test: /\.(ts|tsx)?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },

                {
                    test: /\.(ttf|eot|svg|woff|woff2)(\?[a-z0-9]+)?$/,
                    loader: 'url-loader'
                },
                {
                    test: /\.(png|jpg)$/,
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
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            // Dev
            //new BundleAnalyzerPlugin(),
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
            !isProd &&
                new webpack.DefinePlugin({
                    NODE_ENV: JSON.stringify(nodeEnv)
                }),
            // Prod
            isProd &&
                new HtmlWebpackPlugin({
                    filename: 'index.html',
                    template: 'netlify/index.html'
                }),
            isProd && new CopyWebpackPlugin([{ from: 'netlify' }]),
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
                    banner:
                        `Health Dashboard ` +
                        `Version: ` +
                        PACKAGE.version +
                        ` Date: ` +
                        parseInt(new Date().getMonth() + 1) +
                        `/` +
                        new Date().getDate() +
                        `/` +
                        new Date().getFullYear() +
                        ` @ ` +
                        new Date().getHours() +
                        `:` +
                        new Date().getMinutes()
                }),
            isProd && new MiniCssExtractPlugin('styles.css'),
            isProd &&
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('production')
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
