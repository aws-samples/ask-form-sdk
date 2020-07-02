#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path = require("path");
const model_codegen_1 = require("./model-codegen");
// Define the codegen cli
const command = new commander_1.Command();
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
}
else {
    console.log('args', command.forms, command.source, command.target, command.invocation);
    // get relative paths
    const formsPath = path.join(process.cwd(), command.forms);
    const sourcePath = command.source ? path.join(process.cwd(), command.source) : undefined;
    const targetPath = path.join(process.cwd(), command.target);
    model_codegen_1.ModelCodegen.codegen(formsPath, targetPath, sourcePath, command.invocation);
}
//# sourceMappingURL=index.js.map