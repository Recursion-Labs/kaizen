#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const env = path.join(process.cwd(), ".env");
const example = path.join(process.cwd(), ".example.env");

if (!fs.existsSync(env) && fs.existsSync(example)) {
  fs.copyFileSync(example, env);
  console.log(".example.env has been copied to .env");
}
