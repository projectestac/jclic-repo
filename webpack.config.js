/*global module, require, __dirname */

const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const date = new Date();

const banner = `
${pkg.name} version ${pkg.version} (${date.toISOString().substr(0, 10)})
${pkg.description}
${pkg.homepage}
 
(c) ${date.getFullYear()} ${pkg.author.name || pkg.author}

Licensed under the EUPL, Version 1.2 or -as soon they will be approved by
the European Commission- subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.

You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
Licence for the specific language governing permissions and limitations
under the Licence.

For full license information of included components please see: components.LICENSE

WARNING: This is a compressed version of "${pkg.name}". Full source code is freely available at:
${pkg.repository.url}
`;

/**
 * Inline assets as raw text or Base64 URIs
 * See: https://webpack.js.org/guides/asset-modules/
 */
const assetRules = [
  {
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  },
  {
    test: /\.png$/,
    type: 'asset/inline',
  },
];

/**
 * Main config
 */
const config = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `${pkg.name}.min.js`,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
          }
        },
      },
      ...assetRules,
    ]
  },
  plugins: [],
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'test'),
    watchContentBase: true,
    compress: true,
    port: 8000,
    overlay: true,
    public: 'localhost:8000',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: {
          filename: `${pkg.name}.components.LICENSE`,
          banner: () => banner,
        },
        terserOptions: {
          // See: https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      }),
    ],
  },
  performance: {
    // Avoid "big asset" warnings
    maxAssetSize: 2000000,
    maxEntrypointSize: 2000000,
  },
};

module.exports = (env, argv) => {

  const prod = argv.mode === 'production';

  // Take environment variables from ".env.development", ".env.production"
  // or just ".env" when `mode` is not set
  config.plugins = [
    ...config.plugins || [],
    new Dotenv({
      path: (argv.mode && fs.existsSync(path.resolve(__dirname, `.env.${argv.mode}`))) ? `./.env.${argv.mode}` : './.env',
      safe: true, // load .env.example
      allowEmptyValues: true,
    })
  ];

  // Create source maps only in production builds
  if (prod)
    config.devtool = 'source-map';

  return config;
};
