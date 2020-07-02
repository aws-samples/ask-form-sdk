#!/usr/bin/env node

import { Command } from 'commander';
import path = require('path');
import { ModelCodegen } from './model-codegen';

// Define the codegen cli
const command = new Command();
command
    .version('0.0.1')
    .description('Codegen CLI')
    .option('-f, --forms <forms path>', 'Add the path to forms')
    .option('-s, --source <source model>', 'Add the path to source model json')
    .option('-t, --target <target model>', 'Add the path to target mode json ')
    .option('-i, --invocation <skill invocation', 'Add the skill invoction name string')
    .parse(process.argv);

// Output help or run codegen
if (!process.argv.slice(2).length) {
    command.help();
} else {
    console.log('args', command.forms, command.source, command.target, command.invocation);
    // get relative paths
    const formsPath = path.join(process.cwd(), command.forms);
    const sourcePath = command.source ? path.join(process.cwd(), command.source) : undefined;
    const targetPath = path.join(process.cwd(), command.target);
    ModelCodegen.codegen(formsPath, targetPath, sourcePath, command.invocation);
}
