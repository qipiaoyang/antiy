#!/usr/bin/env node

const yParser = require("yargs-parser");
const { join } = require("path");
const chalk = require('chalk');
const run = require('./lib/run');

const args = yParser(process.argv.slice(2));


const action = args._[0] || '';
const type = args._[1] || '';

(async () => {
    await run({
        action, type, args
    });
    process.exit(0);
})();
