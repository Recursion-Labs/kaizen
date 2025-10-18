#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

let CLI_CEB_DEV = "false";
let CLI_CEB_FIREFOX = "false";
const cli_values = [];

function validate_is_boolean(val, name) {
  if (val !== "true" && val !== "false") {
    console.error(`Invalid value for <${name}>. Please use 'true' or 'false'.`);
    process.exit(1);
  }
}

function validate_key(key, is_editable_section = false) {
  if (!key || key.startsWith("#")) return;
  if (is_editable_section) {
    if (!key.startsWith("CEB_")) {
      console.error(
        `Invalid key: <${key}>. All keys in the editable section must start with 'CEB_'.`,
      );
      process.exit(1);
    }
  } else {
    if (!key.startsWith("CLI_CEB_")) {
      console.error(
        `Invalid key: <${key}>. All CLI keys must start with 'CLI_CEB_'.`,
      );
      process.exit(1);
    }
  }
}

function parse_arguments(argv) {
  argv.forEach((arg) => {
    const [key, ...rest] = arg.split("=");
    const value = rest.join("=");
    validate_key(key);
    switch (key) {
      case "CLI_CEB_DEV":
        CLI_CEB_DEV = value;
        validate_is_boolean(CLI_CEB_DEV, "CLI_CEB_DEV");
        break;
      case "CLI_CEB_FIREFOX":
        CLI_CEB_FIREFOX = value;
        validate_is_boolean(CLI_CEB_FIREFOX, "CLI_CEB_FIREFOX");
        break;
      default:
        cli_values.push(`${key}=${value}`);
        break;
    }
  });
}

function validate_env_keys(envPath) {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  const lines = content.split(/\r?\n/);
  let editable_section_starts = false;
  for (const line of lines) {
    if (!line) continue;
    const key = line.split("=")[0];
    if (key.startsWith("CLI_CEB_")) {
      editable_section_starts = true;
    } else if (editable_section_starts) {
      validate_key(key, true);
    }
  }
}

function create_new_file(envPath) {
  const tempPath = envPath + ".tmp";
  const outLines = [];
  outLines.push("# THOSE VALUES ARE EDITABLE ONLY VIA CLI");
  outLines.push(`CLI_CEB_DEV=${CLI_CEB_DEV}`);
  outLines.push(`CLI_CEB_FIREFOX=${CLI_CEB_FIREFOX}`);
  for (const value of cli_values) outLines.push(value);
  outLines.push("");
  outLines.push("# THOSE VALUES ARE EDITABLE");

  // append existing CEB_ keys from .env
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    const ces = content.split(/\r?\n/).filter((l) => l.startsWith("CEB_"));
    outLines.push(...ces);
  }

  fs.writeFileSync(tempPath, outLines.join("\n"), "utf8");
  fs.renameSync(tempPath, envPath);
}

// Main
const args = process.argv.slice(2);
parse_arguments(args);
const envPath = path.join(process.cwd(), ".env");
validate_env_keys(envPath);
create_new_file(envPath);
console.log("Updated .env");
