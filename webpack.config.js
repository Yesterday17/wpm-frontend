const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  devtool: "source-map",
  module: { rules: [{ test: /\.ts$/, use: ["ts-loader"] }] },
  optimization: {
    minimize: true,
    minimizer: [new TerserWebpackPlugin({ sourceMap: true })],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: { contentBase: "dist", hot: true, port: 8080 },
  resolve: { extensions: [".ts", ".js"] },
  plugins: [new CopyWebpackPlugin({ patterns: [{ from: "public", to: "." }] })],
};
