#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function validateIsBoolean(value, name) {
  if (value !== 'true' && value !== 'false') {
    console.error(`Invalid value for <${name}>. Please use 'true' or 'false'.`);
    process.exit(1);
  }
}

function validateKey(key, isEditable = false) {
  if (!key || key.startsWith('#')) return;
  if (isEditable) {
    if (!key.startsWith('CEB_')) {
      console.error(`Invalid key: <${key}>. All keys in the editable section must start with 'CEB_'.`);
      process.exit(1);
    }
  } else {
    if (!key.startsWith('CLI_CEB_')) {
      console.error(`Invalid key: <${key}>. All CLI keys must start with 'CLI_CEB_'.`);
      process.exit(1);
    }
  }
}

function parseArguments(argv) {
  const cliValues = [];
  let CLI_CEB_DEV = 'false';
  let CLI_CEB_FIREFOX = 'false';

  argv.forEach(arg => {
    const [key, ...rest] = arg.split('=');
    const value = rest.join('=');
    validateKey(key);
    switch (key) {
      case 'CLI_CEB_DEV':
        CLI_CEB_DEV = value;
        validateIsBoolean(CLI_CEB_DEV, 'CLI_CEB_DEV');
        break;
      case 'CLI_CEB_FIREFOX':
        CLI_CEB_FIREFOX = value;
        validateIsBoolean(CLI_CEB_FIREFOX, 'CLI_CEB_FIREFOX');
        break;
      default:
        cliValues.push(`${key}=${value}`);
    }
  });

  return { CLI_CEB_DEV, CLI_CEB_FIREFOX, cliValues };
}

function validateEnvKeys(envPath) {
  const content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const lines = content.split(/\r?\n/);
  let editableStarted = false;
  for (const line of lines) {
    if (!line) continue;
    const key = line.split('=')[0];
    if (key.startsWith('CLI_CEB_')) editableStarted = true;
    else if (editableStarted) validateKey(key, true);
  }
}

function createNewFile(envPath, cliState) {
  const lines = [];
  lines.push('# THOSE VALUES ARE EDITABLE ONLY VIA CLI');
  lines.push(`CLI_CEB_DEV=${cliState.CLI_CEB_DEV}`);
  lines.push(`CLI_CEB_FIREFOX=${cliState.CLI_CEB_FIREFOX}`);
  for (const v of cliState.cliValues) lines.push(v);
  lines.push('');
  lines.push('# THOSE VALUES ARE EDITABLE');

  const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const existingLines = existing.split(/\r?\n/);
  for (const line of existingLines) {
    if (!line) continue;
    if (line.startsWith('CEB_')) lines.push(line);
  }

  fs.writeFileSync(envPath, lines.join('\n'));
}

// Main
const args = process.argv.slice(2);
const cliState = parseArguments(args);
const envPath = path.join(process.cwd(), '.env');
validateEnvKeys(envPath);
createNewFile(envPath, cliState);

console.log('.env updated');
