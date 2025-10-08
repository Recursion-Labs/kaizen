const path = require("path");

module.exports = {
  entry: {
    background: "./src/background/background.ts",
    contentScript: "./src/content/contentScript.ts",
    popup: "./src/popup/popup.tsx"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
};
