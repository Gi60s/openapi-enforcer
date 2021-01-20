const path = require('path')

module.exports = {
  entry: './src/browser.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: 'browser.tsconfig.json'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'openapi-enforcer.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Enforcer'
  }
}
